import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import { ActivityIcon, PlayIcon, RotateCcwIcon, SquareIcon } from 'lucide-qwik';

export const LoadBalancerGame = component$(() => {
  const canvasRef = useSignal<HTMLCanvasElement>();
  const containerRef = useSignal<HTMLDivElement>();

  const isPlaying = useSignal(false);
  const score = useSignal(0);
  const health = useSignal(100);
  const gameOver = useSignal(false);

  const startGame = $(() => {
    isPlaying.value = true;
    gameOver.value = false;
    score.value = 0;
    health.value = 100;
  });

  const stopGame = $(() => {
    isPlaying.value = false;
  });

  useVisibleTask$(({ track }) => {
    track(() => isPlaying.value);
    track(() => gameOver.value);

    if (!isPlaying.value || gameOver.value) return;

    const canvas = canvasRef.value;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game State (Mutable, non-reactive loop variables)
    const state = {
      playerX: canvas.width / 2,
      items: [] as { x: number, y: number, type: 'req' | 'bug', speed: number, radius: number }[],
      lastSpawn: 0,
      spawnRate: 1000,
      gameSpeed: 1,
      animationId: 0
    };

    const resize = () => {
      if (containerRef.value) {
        canvas.width = containerRef.value.clientWidth;
        canvas.height = 400;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const handleInput = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      state.playerX = clientX - rect.left;
    };

    const handleMouseMove = (e: MouseEvent) => handleInput(e.clientX);
    const handleTouchMove = (e: TouchEvent) => handleInput(e.touches[0].clientX);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    const loop = (timestamp: number) => {
      // Clear
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Spawn
      if (timestamp - state.lastSpawn > state.spawnRate) {
        const type = Math.random() > 0.3 ? 'req' : 'bug';
        state.items.push({
          x: Math.random() * (canvas.width - 20) + 10,
          y: -20,
          type,
          speed: (Math.random() * 2 + 2) * state.gameSpeed,
          radius: type === 'req' ? 6 : 10
        });
        state.lastSpawn = timestamp;
        if (state.spawnRate > 400) state.spawnRate -= 10;
        state.gameSpeed += 0.005;
      }

      // Draw Player
      const playerWidth = 80;
      const playerHeight = 10;
      const playerY = canvas.height - 30;
      const pX = Math.max(playerWidth / 2, Math.min(canvas.width - playerWidth / 2, state.playerX));

      ctx.shadowBlur = 15;
      ctx.shadowColor = '#10b981';
      ctx.fillStyle = '#10b981';
      ctx.fillRect(pX - playerWidth / 2, playerY, playerWidth, playerHeight);
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#000';
      ctx.font = '10px monospace';
      ctx.fillText('GATEWAY', pX - 25, playerY + 8);

      // Items
      for (let i = state.items.length - 1; i >= 0; i--) {
        const item = state.items[i];
        item.y += item.speed;

        if (item.type === 'req') {
          ctx.beginPath();
          ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#34d399';
          ctx.fill();
        } else {
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(item.x - item.radius, item.y - item.radius, item.radius * 2, item.radius * 2);
          ctx.fillStyle = '#fff';
          ctx.font = '10px monospace';
          ctx.fillText('ERR', item.x - 10, item.y + 4);
        }

        // Collision
        const caught =
          item.y + item.radius >= playerY &&
          item.y - item.radius <= playerY + playerHeight &&
          item.x >= pX - playerWidth / 2 &&
          item.x <= pX + playerWidth / 2;

        if (caught) {
          if (item.type === 'req') {
            score.value += 10;
          } else {
            health.value -= 25;
            if (health.value <= 0) gameOver.value = true;
          }
          state.items.splice(i, 1);
          continue;
        }
        if (item.y > canvas.height) state.items.splice(i, 1);
      }

      if (isPlaying.value && !gameOver.value) {
        state.animationId = requestAnimationFrame(loop);
      }
    };

    state.animationId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(state.animationId);
    };
  });

  return (
    <div class="backdrop-blur-sm bg-zinc-900/60 border border-zinc-800 p-0 hover:border-emerald-500/50 transition-all duration-300 group flex flex-col items-center overflow-hidden rounded-lg">
      <div class="w-full p-4 border-b border-zinc-800 bg-zinc-900/80 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <ActivityIcon class="text-emerald-500" size={20} />
          <div>
            <h3 class="text-white font-bold text-sm">Load Balancer</h3>
            <p class="text-xs text-zinc-500 font-mono">Accept 200s, Reject 500s</p>
          </div>
        </div>
        <div class="flex items-center gap-4 font-mono text-sm">
          {isPlaying.value && (
            <button
              onClick$={stopGame}
              class="flex items-center gap-2 text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-2 py-1 rounded border border-red-500/20 transition-all"
            >
              <SquareIcon size={10} class="fill-current" /> STOP
            </button>
          )}
          <div class="text-emerald-400">RPS: {score.value}</div>
          <div class={health.value < 50 ? 'text-red-500' : 'text-blue-400'}>Health: {health.value}%</div>
        </div>
      </div>

      <div ref={containerRef} class="relative w-full h-[400px] bg-zinc-950 cursor-crosshair">
        {!isPlaying.value && !gameOver.value && (
          <div class="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10 backdrop-blur-sm">
            <button
              onClick$={startGame}
              class="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-md font-bold transition-all"
            >
              <PlayIcon size={18} class="fill-current" />
              Start Server
            </button>
            <p class="mt-4 text-zinc-400 text-sm font-mono">Move mouse to control Gateway</p>
          </div>
        )}

        {gameOver.value && (
          <div class="absolute inset-0 flex flex-col items-center justify-center bg-red-900/40 z-10 backdrop-blur-md">
            <h3 class="text-3xl font-bold text-white mb-2">SYSTEM CRITICAL</h3>
            <p class="text-red-200 font-mono mb-6">Service Down. Total Requests: {score.value}</p>
            <button
              onClick$={startGame}
              class="flex items-center gap-2 bg-white text-red-900 hover:bg-zinc-200 px-6 py-3 rounded-md font-bold transition-all"
            >
              <RotateCcwIcon size={18} />
              Reboot System
            </button>
          </div>
        )}

        <canvas ref={canvasRef} class="block w-full h-full" />
      </div>
    </div>
  );
});
