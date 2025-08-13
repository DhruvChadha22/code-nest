import { useSocket } from "@/store/useSocket";
import { ActiveSelection, Canvas, Ellipse, FabricObject, InteractiveFabricObject, Line, PencilBrush, Rect, Textbox, util, type TPointerEvent, type TPointerEventInfo } from "fabric";
import { useEffect, useRef, useState } from "react";
import { v4 as UUIDv4 } from "uuid";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { useUser } from "@/store/useUser";
import { toolOptions } from "@/constants/toolOptions";
import { cn } from "@/lib/utils";

// Extend FabricObject to include id property
declare module "fabric" {
	interface FabricObject {
		id?: string;
	}
};

type ExtendedFabricObject = FabricObject & {
	id?: string;
};

type SerializedObjectData = {
	id?: string;
	[key: string]: unknown;
};

const DrawingBoard = ({ roomId }: { roomId?: string }) => {
	const [tool, setTool] = useState<string>("select");
	const [brushColor, setBrushColor] = useState<string>("#ffffff");
	const [brushSize, setBrushSize] = useState<number>(5);

	const toolRef = useRef<string>("select");
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const fabricCanvasRef = useRef<Canvas | null>(null);
	const isApplyingRemoteEdits = useRef<boolean>(false);
	const isClearingCanvas = useRef<boolean>(false);
	const isHandlingGroupModification = useRef<boolean>(false);
	
	const { socket } = useSocket();
	const { userId } = useUser();

	useEffect(() => {
		if (!canvasRef.current) return;

		const canvas = new Canvas(canvasRef.current, {
			backgroundColor: "#011627",
		});
		const container = containerRef.current!;

		InteractiveFabricObject.ownDefaults = {
    		...InteractiveFabricObject.ownDefaults,
			cornerColor: "#ffffff",
			cornerStyle: "circle",
			borderColor: "#3b82f6",
			borderScaleFactor: 1.5,
			transparentCorners: false,
			borderOpacityWhenMoving: 1,
			cornerStrokeColor: "#3b82f6",
		};
		
		canvas.setDimensions({
			width: container.offsetWidth,
			height: container.offsetHeight,
		});
		canvas.renderAll();
		
		// Modify toObject() to include id property in the serialized object
		const originalToObjectFunc = FabricObject.prototype.toObject;
		FabricObject.prototype.toObject = function (this: FabricObject, properties: string[] = []) {
			return originalToObjectFunc.call(this, [...properties, "id"]);
		};

		fabricCanvasRef.current = canvas;

		const handleObjectAdded = (e: { target: ExtendedFabricObject }) => {
			const object = e.target;
			if (!object || isApplyingRemoteEdits.current) return;
			if (!object.id) {
				object.id = UUIDv4();
			}
			socket.emit("object-added", { roomId, object: object.toJSON() });
		};

		const handleObjectModified = (e: { target: ExtendedFabricObject | ActiveSelection }) => {
			const target = e.target;
			if (!target || isApplyingRemoteEdits.current || isHandlingGroupModification.current) return;

			// Multiple objects modified via group
			if ("_objects" in target) {
				const selection = target as ActiveSelection;
				const objects = [...selection._objects] as ExtendedFabricObject[];
				// Ungroup it to normalize absolute positions
				isHandlingGroupModification.current = true;
				canvas.discardActiveObject();
				canvas.renderAll();
				isHandlingGroupModification.current = false;
				objects.forEach((object) => {
					socket.emit("object-modified", { roomId, object: object.toJSON() });
				});
			}
			// Single object modified
			else {
				const object = target as ExtendedFabricObject;
				socket.emit("object-modified", { roomId, object: object.toJSON() });
			}
		};
		
		const handleObjectRemoved = (e: { target: ExtendedFabricObject }) => {
			const object = e.target;
			if (!object || isApplyingRemoteEdits.current || isClearingCanvas.current) return;

			socket.emit("object-removed", { roomId, object: object.toJSON() });
		};
		
		canvas.on("object:added", handleObjectAdded);
		canvas.on("object:modified", handleObjectModified);
		canvas.on("object:removed", handleObjectRemoved);
		
		const addObject = async ({ objectData } : { objectData: SerializedObjectData }) => {
			try {
				const canvas = fabricCanvasRef.current;
				if (!canvas) return;

				const [object] = await util.enlivenObjects([objectData]);
				const extendedObj = object as ExtendedFabricObject;
				
				if (!canvas.getObjects().find((obj) => (obj as ExtendedFabricObject).id === extendedObj.id)) {
					isApplyingRemoteEdits.current = true;
					if (toolRef.current !== "select") extendedObj.selectable = false;
					canvas.add(extendedObj);
					canvas.renderAll();
					isApplyingRemoteEdits.current = false;
				}
			} catch (e) {
				console.log(e);
			}
		};

		const updateObject = ({ objectData } : { objectData: SerializedObjectData }) => {
			const object = canvas
				.getObjects()
				.find(
					(obj) => (obj as ExtendedFabricObject).id === objectData.id
				) as ExtendedFabricObject;
			
			if (!object) return;
			
			const activeObjects = canvas.getActiveObjects();
			if (activeObjects.includes(object)) {
				canvas.discardActiveObject();
			}

			isApplyingRemoteEdits.current = true;
			// Special handling for Line
			if (object.type === "line") {
				const line = object as Line;
				const { x1, y1, x2, y2, ...props } = objectData;
				
				line.set({ x1, y1, x2, y2, ...props });
			} else {
				// Exclude the "type" since it's a read-only property
				const { type, ...props } = objectData;
				object.set(props);
			}
			object.setCoords();
			canvas.renderAll();
			isApplyingRemoteEdits.current = false;
		};
		
		const removeObject = ({ objectData } : { objectData: SerializedObjectData }) => {
			const object = canvas
				.getObjects()
				.find(
					(obj) => (obj as ExtendedFabricObject).id === objectData.id
				) as ExtendedFabricObject;
			
			if (!object) return;
			
			const activeObjects = canvas.getActiveObjects();
			if (activeObjects.includes(object)) {
				canvas.discardActiveObject();
			}

			isApplyingRemoteEdits.current = true;
			canvas.remove(object);
			canvas.renderAll();
			isApplyingRemoteEdits.current = false;
		};
		
		const clearCanvas = () => {
			isApplyingRemoteEdits.current = true;
			canvas.clear();
			canvas.backgroundColor = "#011627";
			canvas.renderAll();
			isApplyingRemoteEdits.current = false;
		};

		const syncCanvas = async ({ allObjects }: { allObjects: SerializedObjectData[] }) => {
			try {
				const canvas = fabricCanvasRef.current;
				if (!canvas) return;

				const objects = await util.enlivenObjects(allObjects);
				isApplyingRemoteEdits.current = true;
				objects.forEach((obj) => {
					const extendedObj = obj as ExtendedFabricObject;
					if (toolRef.current !== "select") extendedObj.selectable = false;
					canvas.add(extendedObj);
				});
				isApplyingRemoteEdits.current = false;
				canvas.renderAll();
			} catch (e) {
				console.log(e);
			}
		};
		
		socket.on("add-object", addObject);
		socket.on("update-object", updateObject);
		socket.on("remove-object", removeObject);
		socket.on("clear-canvas", clearCanvas);
		socket.on("sync-canvas", syncCanvas);
		
		socket.emit("canvas-ready", { roomId, userId });

		const handleResize = () => {
			canvas.setDimensions({
				width: container.offsetWidth,
				height: container.offsetHeight,
			});
			canvas.renderAll();
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);

			canvas.off("object:added", handleObjectAdded);
			canvas.off("object:modified", handleObjectModified);
			canvas.off("object:removed", handleObjectRemoved);

			fabricCanvasRef.current?.dispose();
			fabricCanvasRef.current = null;

			socket.off("add-object", addObject);
			socket.off("update-object", updateObject);
			socket.off("remove-object", removeObject);
			socket.off("clear-canvas", clearCanvas);
			socket.off("sync-canvas", syncCanvas);
		};
	}, []);

	useEffect(() => {
		const canvas = fabricCanvasRef.current;
		if (!canvas) return;

		toolRef.current = tool;
		canvas.isDrawingMode = false;
		canvas.selection = false;

		if (tool !== "select") {
			canvas.forEachObject((object) => (object.selectable = false));
			if (tool !== "delete") canvas.discardActiveObject();
			canvas.renderAll();
		}

		let startX = 0;
		let startY = 0;
		let shape: FabricObject | null = null;
		let handleMouseDown: (options: TPointerEventInfo<TPointerEvent>) => void;
		let handleMouseMove: (options: TPointerEventInfo<TPointerEvent>) => void;
		let handleMouseUp: () => void;

		switch (tool) {
			case "rectangle":
				handleMouseDown = (options: TPointerEventInfo<TPointerEvent>) => {
					const pointer = canvas.getViewportPoint(options.e);
					startX = pointer.x;
					startY = pointer.y;

					shape = new Rect({
						left: startX,
						top: startY,
						fill: "transparent",
						stroke: brushColor,
						strokeWidth: brushSize,
						width: 0,
						height: 0,
					});
				};

				handleMouseMove = (options: TPointerEventInfo<TPointerEvent>) => {
					if (!shape) return;

					const pointer = canvas.getViewportPoint(options.e);
					const rect = shape as Rect;
					rect.set({
						width: Math.abs(pointer.x - startX),
						height: Math.abs(pointer.y - startY),
						left: Math.min(startX, pointer.x),
						top: Math.min(startY, pointer.y),
					});

					if (shape.canvas) {
						canvas.renderAll();
					} else {
						canvas.add(shape);
					}
				};

				handleMouseUp = () => {
					if (shape) {
						if (shape.width !== 0 && shape.height !== 0) {
							if (shape.canvas) {
								canvas.remove(shape);
							}
							canvas.add(shape);
							canvas.renderAll();
							setTool("select");
						}
					}
					shape = null;
				};

				canvas.on("mouse:down", handleMouseDown);
				canvas.on("mouse:move", handleMouseMove);
				canvas.on("mouse:up", handleMouseUp);
				break;
			case "line":
				handleMouseDown = (options: TPointerEventInfo<TPointerEvent>) => {
					const pointer = canvas.getViewportPoint(options.e);
					startX = pointer.x;
					startY = pointer.y;

					shape = new Line([startX, startY, startX, startY], {
						stroke: brushColor,
						strokeWidth: brushSize,
					});
				};

				handleMouseMove = (options: TPointerEventInfo<TPointerEvent>) => {
					if (!shape) return;

					const pointer = canvas.getViewportPoint(options.e);
					const line = shape as Line;
					line.set({ 
						x2: pointer.x, 
						y2: pointer.y,
					});

					if (shape.canvas) {
						canvas.renderAll();
					} else {
						canvas.add(shape);
					}
				};

				handleMouseUp = () => {
					if (shape) {
						const line = shape as Line;
						if (line.x2 !== startX || line.y2 !== startY) {
							if (shape.canvas) {
								canvas.remove(shape);
							}
							canvas.add(shape);
							canvas.renderAll();
							setTool("select");
						}
					}
					shape = null;
				};

				canvas.on("mouse:down", handleMouseDown);
				canvas.on("mouse:move", handleMouseMove);
				canvas.on("mouse:up", handleMouseUp);
				break;
			case "ellipse":
				handleMouseDown = (options: TPointerEventInfo<TPointerEvent>) => {
					const pointer = canvas.getViewportPoint(options.e);
					startX = pointer.x;
					startY = pointer.y;

					shape = new Ellipse({
						left: startX,
						top: startY,
						rx: 0,
						ry: 0,
						fill: "transparent",
						stroke: brushColor,
						strokeWidth: brushSize,
					});
				};

				handleMouseMove = (options: TPointerEventInfo<TPointerEvent>) => {
					if (!shape) return;

					const pointer = canvas.getViewportPoint(options.e);
					const ellipse = shape as Ellipse;
					ellipse.set({
						rx: Math.abs(pointer.x - startX) / 2,
						ry: Math.abs(pointer.y - startY) / 2,
						left: Math.min(startX, pointer.x),
						top: Math.min(startY, pointer.y),
					});
					
					if (shape.canvas) {
						canvas.renderAll();
					} else {
						canvas.add(shape);
					}
				};

				handleMouseUp = () => {
					if (shape) {
						const ellipse = shape as Ellipse;
						if (ellipse.rx !== 0 && ellipse.ry !== 0) {
							if (shape.canvas) {
								canvas.remove(shape);
							}
							canvas.add(shape);
							canvas.renderAll();
							setTool("select");
						}
					}
					shape = null;
				};

				canvas.on("mouse:down", handleMouseDown);
				canvas.on("mouse:move", handleMouseMove);
				canvas.on("mouse:up", handleMouseUp);
				break;
			case "textbox":
				handleMouseDown = (options: TPointerEventInfo<TPointerEvent>) => {
					const pointer = canvas.getViewportPoint(options.e);
					startX = pointer.x;
					startY = pointer.y;

					const textbox = new Textbox("", {
						left: startX,
						top: startY,
						width: 0,
						fill: brushColor,
						fontSize: brushSize * 5,
						editable: true,
					});

					canvas.add(textbox);
					canvas.setActiveObject(textbox);
					canvas.renderAll();

					textbox.enterEditing();

					setTool("select");
				};

				canvas.on("mouse:down", handleMouseDown);
				break;
			case "draw":
				canvas.isDrawingMode = true;
				const brush = new PencilBrush(canvas);
				brush.color = brushColor;
				brush.width = brushSize;
				canvas.freeDrawingBrush = brush;
				break;
			case "select":
				canvas.selection = true;
				canvas.forEachObject((object) => (object.selectable = true));
				break;
			case "delete":
				canvas.getActiveObjects().forEach((object) => {
					canvas.remove(object);
				});
				canvas.discardActiveObject();
				canvas.renderAll();
				setTool("select");
				break;
			case "clear":
				isClearingCanvas.current = true;
				canvas.clear();
				isClearingCanvas.current = false;
				canvas.backgroundColor = "#011627";
				canvas.renderAll();
				setTool("select");
				socket.emit("canvas-cleared", { roomId });
				break;
		}

		return () => {
			canvas.off("mouse:down", handleMouseDown);
			canvas.off("mouse:move", handleMouseMove);
			canvas.off("mouse:up", handleMouseUp);
		};
	}, [tool, brushColor, brushSize]);

    return (
		<div className="relative">
			<div className="flex items-start justify-between">
				<div className="absolute inset-0 z-2 flex flex-col items-center justify-center lg:gap-1 bg-[#232329] rounded-lg p-1 m-1 lg:m-4 h-fit w-fit">
					{toolOptions.map((t) => {
						const { type, icon, fill } = t;
						const Icon = icon;
						return <Button
							key={type}
							className={cn("hover:cursor-pointer", tool === type ? "bg-[#283061] hover:bg-[#283061]" : "bg-[#232329] hover:bg-[#2E2D39]")}
							onClick={() => setTool(type)}
						>
							<Icon className={cn("size-3 md:size-4", (tool === type && fill) ? "fill-white" : "fill-none")} />
						</Button>
					})}
				</div>
				<div className="absolute top-0 right-0 z-2 flex items-center gap-3 m-1 lg:m-4 bg-[#232329] rounded-lg px-2 py-1 h-fit w-fit">
					<label className="text-sm">Color:</label>
					<Input
						type="color"
						value={brushColor}
						onChange={e => setBrushColor(e.target.value)}
						className="size-8 p-0 border-none hover:cursor-pointer"
					/>
					<label className="text-sm">Size:</label>
					<Slider
						min={1}
						max={20}
						step={1}
						value={[brushSize]}
						onValueChange={val => setBrushSize(val[0])}
						className="w-24"
					/>
				</div>
			</div>
			<div className="absolute z-1 h-screen lg:h-[calc(100vh-100px)] w-full overflow-hidden" ref={containerRef}>
				<canvas ref={canvasRef} />
			</div>
		</div>
    );
};

export default DrawingBoard;
