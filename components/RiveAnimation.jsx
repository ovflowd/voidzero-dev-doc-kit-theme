import withIsland from '@doc-kit/generator-react/html/ui/islands/withIsland.jsx';
import { useEffect, useRef } from 'preact/hooks';

import { classNames } from '../utils.mjs';

/**
 * A Rive animation that plays once scrolled into view. The Rive runtime is
 * only loaded by then.
 */
const RiveAnimation = ({
  src,
  width,
  height,
  stateMachines = 'State Machine 1',
  class: className,
}) => {
  const canvas = useRef(null);

  useEffect(() => {
    let rive;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || rive) return;

        observer.disconnect();

        const [runtime, { default: wasm }] = await Promise.all([
          import('@rive-app/canvas-lite'),
          import('@rive-app/canvas-lite/rive.wasm?url'),
        ]);

        runtime.RuntimeLoader.setWasmUrl(wasm);

        rive = new runtime.Rive({
          src,
          canvas: canvas.current,
          stateMachines,
          autoplay: true,
          onLoad: () => rive?.resizeDrawingSurfaceToCanvas(),
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(canvas.current);

    return () => {
      observer.disconnect();
      rive?.cleanup();
    };
  }, [src]);

  return (
    <div class="touch-none select-none">
      <canvas ref={canvas} width={width} height={height} class={classNames('w-full', className)} />
    </div>
  );
};

// `on:visible` never fires on doc-kit's islands (they are `display: contents`),
// so hydrate when idle; the Rive runtime still waits for the canvas to show
export default withIsland(RiveAnimation, { name: 'RiveAnimation', on: { idle: true } });
