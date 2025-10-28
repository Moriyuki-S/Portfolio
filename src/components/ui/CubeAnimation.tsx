import { cn } from '$lib/utils';
import { OrbitControls } from '@react-three/drei';
import { Canvas, type ThreeEvent, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

interface CubeAnimationProps {
    className?: string;
}

const CUBE_SIZE = 5.6;

const createPrng = (seed: number) => {
    let value = seed;
    return () => {
        value += 1;
        const x = Math.sin(value) * 10000;
        return x - Math.floor(x);
    };
};

const readStoredTheme = () => {
    if (typeof window === 'undefined') {
        return null;
    }
    try {
        return window.localStorage.getItem('theme');
    } catch {
        return null;
    }
};

const getIsDarkMode = () => {
    if (typeof window === 'undefined') {
        return false;
    }
    const root = document.documentElement;
    const stored = readStoredTheme();
    if (stored === 'dark') {
        return true;
    }
    if (stored === 'theme-light') {
        return false;
    }
    if (root.classList.contains('dark')) {
        return true;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const useIsDarkMode = () => {
    const [isDark, setIsDark] = useState<boolean>(() => getIsDarkMode());

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        const root = document.documentElement;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const update = () => {
            setIsDark(getIsDarkMode());
        };

        const observer = new MutationObserver(update);
        observer.observe(root, {
            attributes: true,
            attributeFilter: ['class'],
        });
        mediaQuery.addEventListener('change', update);
        window.addEventListener('storage', update);
        update();

        return () => {
            observer.disconnect();
            mediaQuery.removeEventListener('change', update);
            window.removeEventListener('storage', update);
        };
    }, []);

    return isDark;
};

interface CubeConfig {
    id: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: number;
    animationOffset: number;
    floatIntensity: number;
    color: THREE.ColorRepresentation;
}

const Cube = ({
    position,
    scale = 1,
    rotation = [0, 0, 0],
    animationOffset = 0,
    floatIntensity = 0.5,
    color,
    isDarkMode,
}: {
    position: [number, number, number];
    scale?: number;
    rotation?: [number, number, number];
    animationOffset?: number;
    floatIntensity?: number;
    color: THREE.ColorRepresentation;
    isDarkMode: boolean;
}) => {
    const groupRef = useRef<THREE.Group>(null);
    const surfaceMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
    const lineMaterialRef = useRef<THREE.LineBasicMaterial>(null);
    const baseRotation = useMemo(
        () => new THREE.Euler(...rotation),
        [rotation],
    );
    const manualRotation = useRef(new THREE.Euler(...rotation));
    const basePosition = useMemo(
        () => new THREE.Vector3(...position),
        [position],
    );
    const floatStrength = Math.max(0, floatIntensity);
    const baseColor = useMemo(() => new THREE.Color(color), [color]);
    const surfaceBaseColor = useMemo(
        () => baseColor.clone().multiplyScalar(isDarkMode ? 0.26 : 0.18),
        [baseColor, isDarkMode],
    );
    const surfaceHighlightColor = useMemo(
        () =>
            baseColor
                .clone()
                .lerp(
                    new THREE.Color(isDarkMode ? '#cbd5f5' : '#ffffff'),
                    isDarkMode ? 0.45 : 0.6,
                ),
        [baseColor, isDarkMode],
    );
    const lineBaseColor = useMemo(() => {
        const color = baseColor.clone();
        if (isDarkMode) {
            return color.multiplyScalar(1.1);
        }
        return color.multiplyScalar(0.7);
    }, [baseColor, isDarkMode]);
    const lineHighlightColor = useMemo(() => {
        if (isDarkMode) {
            return baseColor.clone().lerp(new THREE.Color('#f8fafc'), 0.55);
        }
        return baseColor.clone().lerp(new THREE.Color('#1e3a8a'), 0.35);
    }, [baseColor, isDarkMode]);
    const clickPulse = useRef(0);
    const dragState = useRef<{
        isActive: boolean;
        hasMoved: boolean;
        pointerId: number | null;
        startPointer: THREE.Vector2;
        startRotation: THREE.Euler;
    }>({
        isActive: false,
        hasMoved: false,
        pointerId: null,
        startPointer: new THREE.Vector2(),
        startRotation: new THREE.Euler(...rotation),
    });
    const easeOut = (value: number) => 1 - (1 - value) ** 3;
    const movementThreshold = 6;

    const edges = useMemo(() => {
        const geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
        const edgeGeometry = new THREE.EdgesGeometry(geometry);
        geometry.dispose();
        return edgeGeometry;
    }, []);

    useEffect(() => {
        return () => {
            edges.dispose();
        };
    }, [edges]);

    useEffect(() => {
        manualRotation.current.copy(baseRotation);
        dragState.current.startRotation.copy(baseRotation);
        if (groupRef.current) {
            groupRef.current.rotation.copy(baseRotation);
        }
    }, [baseRotation]);

    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.position.copy(basePosition);
        }
    }, [basePosition]);

    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.scale.setScalar(scale);
        }
    }, [scale]);

    const triggerClick = () => {
        clickPulse.current = 1;
    };

    const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        if (!groupRef.current) {
            return;
        }
        dragState.current.isActive = true;
        dragState.current.hasMoved = false;
        dragState.current.pointerId = event.pointerId;
        dragState.current.startPointer.set(event.clientX, event.clientY);
        dragState.current.startRotation.copy(manualRotation.current);
        const nativeTarget = event.nativeEvent.target as
            | HTMLElement
            | null
            | undefined;
        nativeTarget?.setPointerCapture?.(event.pointerId);
    };

    const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
        if (!dragState.current.isActive || !groupRef.current) {
            return;
        }
        event.stopPropagation();
        const deltaX = event.clientX - dragState.current.startPointer.x;
        const deltaY = event.clientY - dragState.current.startPointer.y;
        if (
            !dragState.current.hasMoved &&
            (Math.abs(deltaX) > movementThreshold ||
                Math.abs(deltaY) > movementThreshold)
        ) {
            dragState.current.hasMoved = true;
        }
        if (!dragState.current.hasMoved) {
            return;
        }
        const rotationX = dragState.current.startRotation.x + deltaY * 0.005;
        const rotationY = dragState.current.startRotation.y + deltaX * 0.005;
        manualRotation.current.set(
            rotationX,
            rotationY,
            dragState.current.startRotation.z,
        );
        groupRef.current.rotation.copy(manualRotation.current);
    };

    const finishDrag = (
        event: ThreeEvent<PointerEvent>,
        shouldTriggerClick: boolean,
    ) => {
        if (!dragState.current.isActive) {
            return;
        }
        dragState.current.isActive = false;
        const nativeTarget = event.nativeEvent.target as
            | HTMLElement
            | null
            | undefined;
        if (dragState.current.pointerId !== null) {
            nativeTarget?.releasePointerCapture?.(dragState.current.pointerId);
        }
        if (shouldTriggerClick && !dragState.current.hasMoved) {
            triggerClick();
        }
        dragState.current.pointerId = null;
    };

    const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        finishDrag(event, true);
    };

    const handlePointerLeave = (event: ThreeEvent<PointerEvent>) => {
        finishDrag(event, false);
    };

    const handlePointerCancel = (event: ThreeEvent<PointerEvent>) => {
        finishDrag(event, false);
    };

    useFrame((state) => {
        if (!groupRef.current) {
            return;
        }
        const delta = state.clock.getDelta();
        if (dragState.current.isActive) {
            groupRef.current.rotation.copy(manualRotation.current);
            groupRef.current.position.copy(basePosition);
        } else {
            const time = state.clock.getElapsedTime() + animationOffset;
            groupRef.current.rotation.x =
                manualRotation.current.x + Math.sin(time * 0.6) * 0.35;
            groupRef.current.rotation.y =
                manualRotation.current.y + Math.cos(time * 0.4) * 0.45;
            groupRef.current.rotation.z =
                manualRotation.current.z + Math.sin(time * 0.5) * 0.25;
            groupRef.current.position.x =
                basePosition.x + Math.cos(time * 0.25) * floatStrength * 0.8;
            groupRef.current.position.y =
                basePosition.y + Math.sin(time * 0.5) * floatStrength * 1.2;
            groupRef.current.position.z =
                basePosition.z + Math.sin(time * 0.3) * floatStrength * 0.6;
        }
        if (clickPulse.current > 0) {
            clickPulse.current = Math.max(clickPulse.current - delta * 1.8, 0);
        }
        const pulseStrength = easeOut(clickPulse.current);
        const scaleMultiplier = 1 + pulseStrength * 0.35;
        groupRef.current.scale.setScalar(scale * scaleMultiplier);

        const surfaceMaterial = surfaceMaterialRef.current;
        if (surfaceMaterial) {
            surfaceMaterial.color
                .copy(surfaceBaseColor)
                .lerp(surfaceHighlightColor, pulseStrength);
            surfaceMaterial.emissive
                .copy(baseColor)
                .multiplyScalar(
                    isDarkMode
                        ? 0.25 + pulseStrength * 0.5
                        : 0.15 + pulseStrength * 0.35,
                );
            surfaceMaterial.emissiveIntensity =
                (isDarkMode ? 0.7 : 0.5) +
                pulseStrength * (isDarkMode ? 1.1 : 0.8);
            surfaceMaterial.opacity =
                (isDarkMode ? 0.24 : 0.16) +
                pulseStrength * (isDarkMode ? 0.18 : 0.14);
        }

        const edgeMaterial = lineMaterialRef.current;
        if (edgeMaterial) {
            edgeMaterial.color
                .copy(lineBaseColor)
                .lerp(lineHighlightColor, pulseStrength);
        }
    });

    return (
        <group
            ref={groupRef}
            position={position}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            onPointerCancel={handlePointerCancel}
        >
            <mesh>
                <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
                <meshStandardMaterial
                    ref={surfaceMaterialRef}
                    color={surfaceBaseColor}
                    transparent
                    opacity={isDarkMode ? 0.24 : 0.16}
                    metalness={0.2}
                    roughness={0.5}
                    emissive={baseColor
                        .clone()
                        .multiplyScalar(isDarkMode ? 0.3 : 0.2)}
                    emissiveIntensity={isDarkMode ? 0.8 : 0.6}
                />
            </mesh>
            <lineSegments geometry={edges}>
                <lineBasicMaterial
                    ref={lineMaterialRef}
                    color={lineBaseColor}
                    transparent
                    opacity={isDarkMode ? 0.95 : 1}
                />
            </lineSegments>
        </group>
    );
};

export const CubeAnimation = ({ className }: CubeAnimationProps) => {
    const isDarkMode = useIsDarkMode();
    const palette = useMemo<THREE.ColorRepresentation[]>(
        () =>
            isDarkMode
                ? ['#bfdbfe', '#c4b5fd', '#f0abfc', '#e9d5ff', '#bae6fd']
                : ['#38bdf8', '#60a5fa', '#818cf8', '#a855f7', '#22d3ee'],
        [isDarkMode],
    );
    const ambientLightColor = isDarkMode ? '#0f172a' : '#f8fafc';
    const directionalLightColor = isDarkMode ? '#93c5fd' : '#60a5fa';
    const pointLightColor = isDarkMode ? '#f472b6' : '#22d3ee';
    const spread = useMemo(
        () => ({ x: CUBE_SIZE * 8, y: CUBE_SIZE * 4.2, z: CUBE_SIZE * 7 }),
        [],
    );

    const cubeConfigs = useMemo<CubeConfig[]>(() => {
        const random = createPrng(42);
        const configs: CubeConfig[] = [];

        const rowSettings = [
            {
                key: 'lower',
                columns: 5,
                horizontalSpan: 0.95,
                yBase: -CUBE_SIZE * 0.85,
                yJitter: CUBE_SIZE * 0.4,
                depth: -CUBE_SIZE * 0.1,
                depthJitter: CUBE_SIZE * 0.6,
                scaleRange: [0.26, 0.48] as const,
                floatRange: [0.35, 0.55] as const,
            },
            {
                key: 'middle',
                columns: 6,
                horizontalSpan: 1.0,
                yBase: -CUBE_SIZE * 0.1,
                yJitter: CUBE_SIZE * 0.35,
                depth: -CUBE_SIZE * 0.35,
                depthJitter: CUBE_SIZE * 0.5,
                scaleRange: [0.22, 0.38] as const,
                floatRange: [0.38, 0.58] as const,
            },
            {
                key: 'upper',
                columns: 4,
                horizontalSpan: 0.75,
                yBase: CUBE_SIZE * 0.5,
                yJitter: CUBE_SIZE * 0.35,
                depth: -CUBE_SIZE * 0.65,
                depthJitter: CUBE_SIZE * 0.5,
                scaleRange: [0.18, 0.3] as const,
                floatRange: [0.32, 0.48] as const,
            },
        ];

        let cubeCounter = 0;

        rowSettings.forEach((row, rowIndex) => {
            const span = spread.x * row.horizontalSpan;
            for (let col = 0; col < row.columns; col += 1) {
                const t = row.columns > 1 ? col / (row.columns - 1) : 0.5;
                const x =
                    -span / 2 + t * span + (random() - 0.5) * CUBE_SIZE * 0.25;
                const y = row.yBase + (random() - 0.5) * row.yJitter;
                const z = row.depth + (random() - 0.5) * row.depthJitter;

                const position: [number, number, number] = [x, y, z];
                const rotation: [number, number, number] = [
                    random() * Math.PI,
                    random() * Math.PI,
                    random() * Math.PI,
                ];
                const [scaleMin, scaleMax] = row.scaleRange;
                const scale = scaleMin + random() * (scaleMax - scaleMin);
                const [floatMin, floatMax] = row.floatRange;
                const floatIntensity =
                    floatMin + random() * (floatMax - floatMin);
                const paletteIndex = cubeCounter % palette.length;

                configs.push({
                    id: `cube-${row.key}-${col}`,
                    position,
                    rotation,
                    scale,
                    animationOffset:
                        random() * 1.8 + rowIndex * 0.45 + col * 0.12,
                    floatIntensity,
                    color: palette[paletteIndex],
                });

                cubeCounter += 1;
            }
        });

        const accentCount = 2;
        for (let i = 0; i < accentCount; i += 1) {
            const position: [number, number, number] = [
                (random() - 0.5) * spread.x * 0.6,
                CUBE_SIZE * (0.9 + random() * 0.7),
                -CUBE_SIZE * (0.9 + random() * 0.5),
            ];
            configs.push({
                id: `cube-accent-${i}`,
                position,
                rotation: [
                    random() * Math.PI,
                    random() * Math.PI,
                    random() * Math.PI,
                ],
                scale: 0.18 + random() * 0.2,
                animationOffset: random() * 2.3 + i * 0.35,
                floatIntensity: 0.35 + random() * 0.35,
                color: palette[(cubeCounter + i) % palette.length],
            });
        }

        return configs;
    }, [palette, spread]);

    return (
        <div className={cn(className)}>
            <Canvas
                camera={{ position: [12, 13, 18], fov: 50 }}
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight
                    intensity={isDarkMode ? 0.35 : 0.25}
                    color={ambientLightColor}
                />
                <directionalLight
                    position={[12, 18, 14]}
                    intensity={isDarkMode ? 1.6 : 1.3}
                    color={directionalLightColor}
                />
                <pointLight
                    position={[-10, 6, 10]}
                    intensity={isDarkMode ? 1.1 : 0.75}
                    color={pointLightColor}
                />

                {cubeConfigs.map((config) => (
                    <Cube
                        key={config.id}
                        position={config.position}
                        rotation={config.rotation}
                        scale={config.scale}
                        animationOffset={config.animationOffset}
                        floatIntensity={config.floatIntensity}
                        color={config.color}
                        isDarkMode={isDarkMode}
                    />
                ))}

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={false}
                    target={[0, -CUBE_SIZE * 0.2, -CUBE_SIZE * 0.6]}
                />
            </Canvas>
        </div>
    );
};
