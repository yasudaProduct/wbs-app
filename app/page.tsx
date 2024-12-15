import ProjectList from './components/ProjectList';
import { ProjectProvider } from './contexts/ProjectContext';

export default function Home() {
  return (
    <ProjectProvider>
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">WBSマネジメントツール</h1>
        <ProjectList />
      </main>
    </ProjectProvider>
  );
}

