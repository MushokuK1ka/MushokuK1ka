// GitHub fetches the profile image through its proxy, so use the room's Beijing clock.
const daySeconds = 24 * 3600;
const scenes = [
  { key: 'late', hour: 0 },
  { key: 'morning', hour: 6, hands: [315, 102, 113] },
  { key: 'day', hour: 9, hands: [76, 116, 184] },
  { key: 'night', hour: 18, hands: [369, 183, 140] },
];
const schedule = [...scenes.map((scene, index) => [scene.hour, index]), [22, 0], [24, 0]];
const times = schedule.map(([hour]) => hour / 24).join(';');
const offsets = schedule.map(([, index]) => '0 ' + (-360 * index)).join(';');
let artwork;

async function imageData(assets, origin, name) {
  const response = await assets.fetch(new URL('/images/studio-' + name + '.webp', origin).href);
  if (!response.ok) throw new Error('Missing room artwork: ' + name);
  const bytes = new Uint8Array(await response.arrayBuffer());
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 8192) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
  }
  return 'data:image/webp;base64,' + btoa(binary);
}

async function drawScene(assets, origin, { key, hands }, index) {
  const [background, pose] = await Promise.all([
    imageData(assets, origin, key),
    hands && imageData(assets, origin, key + '-hands'),
  ]);
  const base = '<image id="bg-' + key + '" width="640" height="360" href="' + background + '"/>';
  let motion = '<g mask="url(#blanket)"><use class="breathing" href="#bg-late"/></g>';
  if (hands) {
    const [x, y, size] = hands;
    motion = '<image class="pose ' + key + '" x="' + x + '" y="' + y + '" width="' + size +
      '" height="' + size + '" href="' + pose + '"/>';
  }
  return '<g transform="translate(0 ' + index * 360 + ')">' + base + motion + '</g>';
}

export async function profileRoom(request, assets, now = Date.now()) {
  const headers = {
    'Content-Type': 'image/svg+xml; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
    'X-Content-Type-Options': 'nosniff',
  };
  if (request.method === 'HEAD') return new Response(null, { headers });
  if (!artwork) {
    const panels = await Promise.all(scenes.map((scene, i) => drawScene(assets, request.url, scene, i)));
    artwork = panels.join('');
  }
  const seconds = (now / 1000 + 8 * 3600) % daySeconds;
  const [, initial] = schedule.findLast(([hour]) => hour * 3600 <= seconds);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360" data-scene="${scenes[initial].key}">
<title>像素房间</title>
<defs><radialGradient id="fade"><stop offset="60%" stop-color="white"/><stop offset="100%" stop-color="black"/></radialGradient>
<mask id="blanket" maskUnits="userSpaceOnUse" x="326" y="162" width="109" height="61"><ellipse cx="381" cy="192" rx="54" ry="30" fill="url(#fade)"/></mask></defs>
<style>
image{image-rendering:pixelated}.pose{opacity:0}
.morning{animation:sip 5.8s step-end infinite}.day{animation:type 2.6s step-end infinite}.night{animation:page 6.2s step-end infinite}
@keyframes sip{47%{opacity:1}0%,74%,100%{opacity:0}}
@keyframes type{13%,36%{opacity:1}0%,25%,50%,100%{opacity:0}}
@keyframes page{63%{opacity:1}0%,80%,100%{opacity:0}}
.breathing{animation:breath 4.8s ease-in-out infinite}@keyframes breath{46%{transform:translateY(-1px)}}
@media(prefers-reduced-motion:reduce){.pose,.breathing{animation:none}}
</style>
<g transform="translate(0 ${-360 * initial})">
<animateTransform attributeName="transform" type="translate" calcMode="discrete" dur="86400s" begin="-${seconds}s" repeatCount="indefinite" keyTimes="${times}" values="${offsets}"/>
${artwork}</g></svg>`;
  return new Response(svg, { headers });
}
