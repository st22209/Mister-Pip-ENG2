import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { OrbitControls, useGLTF, Html, useProgress } from "@react-three/drei";

const CanvasLoader = () => {
	const { progress } = useProgress();
	return (
		<Html
			as="div"
			center
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
			}}
		>
			<span className="canvas-loader"></span>
			<p
				style={{
					fontSize: 14,
					color: "red",
					fontWeight: 800,
					marginTop: 40,
				}}
			>
				{`Loading 3d Book: ${progress.toFixed(2)}`}%
			</p>
		</Html>
	);
};

const BookModel = () => {
	const book = useGLTF("./misterpip.glb");

	return (
		<primitive
			object={book.scene}
			scale={3.5}
			position-y={0}
			rotation-y={0}
		/>
	);
};

useGLTF.preload("/misterpip.glb");

const MisterPipBook = () => {
	const [autoRotate, setAutoRotate] = useState(true);
	useEffect(() => {
		// stop rotating the book when the user clicks the "s" key
		const keyHandler = (event: KeyboardEvent) => {
			if (event.key === "s") {
				event.preventDefault();
				setAutoRotate(!autoRotate);
			}
		};
		document.addEventListener("keydown", keyHandler);
		return () => {
			document.removeEventListener("keydown", keyHandler);
		};
	});

	return (
		<Canvas
			shadows
			frameloop="demand"
			dpr={[1, 2]}
			gl={{ preserveDrawingBuffer: true }}
			camera={{
				fov: 45,
				near: 0.1,
				far: 200,
				position: [-4, 3, 6],
			}}
		>
			<Suspense fallback={<CanvasLoader />}>
				<OrbitControls
					autoRotate={autoRotate}
					enableZoom={false}
					enablePan={false}
					maxPolarAngle={Math.PI / 2}
					minPolarAngle={Math.PI / 2}
					// autoRotateSpeed={5}
				/>
				<directionalLight position={[10, 3, 1]} intensity={0.1} />

				<ambientLight intensity={0.75} />
				<BookModel />
			</Suspense>
		</Canvas>
	);
};

export default MisterPipBook;
