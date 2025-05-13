
import GameContainer from '@/components/Game/GameContainer';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-game-dark">
      <GameContainer />
      <div className="fixed bottom-4 right-4 z-50">
        <Link to="/test-canvas" className="bg-blue-600 text-white px-4 py-2 rounded block">
          Test Canvas
        </Link>
      </div>
    </div>
  );
};

export default Index;
