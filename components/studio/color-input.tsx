"use client";
import { useState } from "react";
export function ColorInput({ initial = "#1D3FFF" }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return <div className="field"><label htmlFor="backgroundColor">Background colour / HEX</label><div className="color-field"><input id="backgroundColor" name="backgroundColor" value={value} onChange={(e) => setValue(e.target.value)} pattern="#[0-9a-fA-F]{6}" maxLength={7} required /><span className="color-preview" style={{ background: /^#[0-9a-fA-F]{6}$/.test(value) ? value : "transparent" }} aria-hidden="true" /></div></div>;
}
