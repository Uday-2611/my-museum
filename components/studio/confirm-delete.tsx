"use client";
export function ConfirmDelete({ children, message }: { children: React.ReactNode; message: string }) { return <div onClick={(e) => { if (!window.confirm(message)) e.preventDefault(); }}>{children}</div>; }
