import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useSceneStore } from '@/app/scenes';
import { useProjectStore } from '@/app/projects/store';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';

export function EditorLayout() {
  const navigate = useNavigate();
  const { channelId, projectId } = useParams<{ channelId: string; projectId: string }>();
  const setCurrentProjectId = useSceneStore((state) => state.setCurrentProjectId);
  const currentProject = useProjectStore((state) => state.currentProject);

  useEffect(() => {
    if (projectId) {
      setCurrentProjectId(projectId);
    }
  }, [projectId, setCurrentProjectId]);


  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
