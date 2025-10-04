import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, Check, X } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface NotesTabProps {
  userId: string;
}

export function NotesTab({ userId }: NotesTabProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [editNote, setEditNote] = useState({ title: "", content: "" });
  const [showNewNote, setShowNewNote] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotes();
  }, [userId]);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load notes",
        variant: "destructive",
      });
    } else {
      setNotes(data || []);
    }
  };

  const handleCreate = async () => {
    if (!newNote.title.trim()) return;

    const { error } = await supabase.from("notes").insert({
      user_id: userId,
      title: newNote.title,
      content: newNote.content,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Note created successfully",
      });
      setNewNote({ title: "", content: "" });
      setShowNewNote(false);
      fetchNotes();
    }
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase
      .from("notes")
      .update({ title: editNote.title, content: editNote.content })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
      setEditingId(null);
      fetchNotes();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("notes").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
      fetchNotes();
    }
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditNote({ title: note.title, content: note.content || "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Notes</h2>
        <Button onClick={() => setShowNewNote(!showNewNote)}>
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      {showNewNote && (
        <Card className="p-6 space-y-4 shadow-[var(--shadow-soft)]">
          <Input
            placeholder="Note title"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          />
          <Textarea
            placeholder="Note content (optional)"
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            rows={4}
          />
          <div className="flex gap-2">
            <Button onClick={handleCreate}>
              <Check className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={() => setShowNewNote(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <Card
            key={note.id}
            className="p-6 space-y-3 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-all"
          >
            {editingId === note.id ? (
              <>
                <Input
                  value={editNote.title}
                  onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
                />
                <Textarea
                  value={editNote.content}
                  onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
                  rows={4}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleUpdate(note.id)}>
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-lg">{note.title}</h3>
                {note.content && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
                )}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(note)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(note.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </>
            )}
          </Card>
        ))}
      </div>

      {notes.length === 0 && !showNewNote && (
        <div className="text-center text-muted-foreground py-12">
          <p>No notes yet. Create your first note!</p>
        </div>
      )}
    </div>
  );
}
