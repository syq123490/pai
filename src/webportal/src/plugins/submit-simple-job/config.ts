import * as qs from "qs";

const query = ((script) => {
  if (script === null) { return {}; }

  const src = script.getAttribute("src");
  if (src === null) { return {}; }

  const search = src.slice(src.indexOf("?") + 1);
  return qs.parse(search);
})(document.currentScript) as {
  nfs: string,
};

// TODO: remove hard-coded value after plugin configuration fixed.
export const nfs = query.nfs || "10.1.0.35:/users";
