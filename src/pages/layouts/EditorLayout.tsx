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

  const navigateToDashboard = () => {
    if (channelId) {
      navigate(`/channels/${channelId}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="fixed top-4 right-4 z-50 flex gap-2 bg-white rounded-lg shadow-lg p-2">
        <Button
          variant="outline"
          size="sm"
          onClick={navigateToDashboard}
        >
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Dashboard
        </Button>
      </div>

      <Outlet />
    </div>
  );
}
