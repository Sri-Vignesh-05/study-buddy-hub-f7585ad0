import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, ClipboardList } from 'lucide-react';

const Admin = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, tasksRes] = await Promise.all([
          fetch('http://localhost:5000/api/students').then(r => r.json()),
          fetch('http://localhost:5000/api/tasks').then(r => r.json())
        ]);

        if (studentsRes.data) setStudents(studentsRes.data);
        if (tasksRes.data) setTasks(tasksRes.data);
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const getStudentTasks = (studentId: string) => tasks.filter(t => t.student_id === studentId);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          <Link to="/"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button></Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent className="p-6 flex items-center gap-4">
            <Users className="w-10 h-10 text-primary" />
            <div><p className="text-2xl font-bold">{students.length}</p><p className="text-muted-foreground">Total Students</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-6 flex items-center gap-4">
            <ClipboardList className="w-10 h-10 text-secondary" />
            <div><p className="text-2xl font-bold">{tasks.length}</p><p className="text-muted-foreground">Total Tasks</p></div>
          </CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>All Students</CardTitle></CardHeader>
          <CardContent>
            {loading ? <p>Loading...</p> : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Streak</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.age}</TableCell>
                      <TableCell>{s.current_streak} days</TableCell>
                      <TableCell>{getStudentTasks(s.id).length} tasks</TableCell>
                      <TableCell>{new Date(s.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
