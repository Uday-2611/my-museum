"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { reorderArtworks, reorderRooms } from "@/lib/studio/actions";

export type SortItem = { id: string; title: string; meta: string; href: string; editHref: string };
function Row({ item, index }: { item: SortItem; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  return <li ref={setNodeRef} className="studio-row" style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? .5 : 1, position: "relative", zIndex: isDragging ? 2 : 0 }}>
    <button className="drag-handle" type="button" aria-label={`Drag ${item.title} to reorder`} {...attributes} {...listeners}>≡</button>
    <span className="row-muted">{String(index + 1).padStart(2, "0")}</span><Link href={item.href}>{item.title}</Link><span className="row-muted">{item.meta}</span><Link className="row-link" href={item.editHref}>EDIT</Link>
  </li>;
}
export function SortableList({ initial, roomId }: { initial: SortItem[]; roomId?: string }) {
  const [items, setItems] = useState(initial), [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  function onDragEnd(event: DragEndEvent) {
    if (!event.over || event.active.id === event.over.id) return;
    const from = items.findIndex((item) => item.id === event.active.id), to = items.findIndex((item) => item.id === event.over!.id);
    if (from < 0 || to < 0) return;
    const previous = items, next = arrayMove(items, from, to);
    setItems(next); setError("");
    startTransition(async () => { try { if (roomId) await reorderArtworks(roomId, next.map((item) => item.id)); else await reorderRooms(next.map((item) => item.id)); } catch { setItems(previous); setError("Order could not be saved. Refresh and try again."); } });
  }
  return <><DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}><SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}><ol className="studio-list">{items.map((item, index) => <Row key={item.id} item={item} index={index} />)}</ol></SortableContext></DndContext><p className="studio-order-status" role="status">{error || (pending ? "SAVING ORDER…" : "")}</p></>;
}
