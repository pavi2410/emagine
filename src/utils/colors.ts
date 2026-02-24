export const generateMeshGradient = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h1 = Math.abs(hash % 360);
  const h2 = Math.abs((hash * 2) % 360);
  const h3 = Math.abs((hash * 3) % 360);
  const h4 = Math.abs((hash * 4) % 360);
  
  return `
    radial-gradient(circle at 0% 0%, hsla(${h1}, 90%, 65%, 1) 0%, transparent 60%),
    radial-gradient(circle at 100% 0%, hsla(${h2}, 90%, 60%, 1) 0%, transparent 60%),
    radial-gradient(circle at 100% 100%, hsla(${h3}, 90%, 65%, 1) 0%, transparent 60%),
    radial-gradient(circle at 0% 100%, hsla(${h4}, 90%, 60%, 1) 0%, transparent 60%),
    linear-gradient(135deg, hsla(${h1}, 80%, 50%, 1), hsla(${h3}, 80%, 50%, 1))
  `;
}
