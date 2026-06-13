export const normalize = (text) => {
  let t = text.toLowerCase().trim();
  t = t.replace(/\btruck\b/g, 'vehicle');
  t = t.replace(/\bvan\b/g, 'vehicle');
  t = t.replace(/\bshipment number\b/g, 'shipment');
  t = t.replace(/\btracking number\b/g, 'shipment');
  return t;
};
