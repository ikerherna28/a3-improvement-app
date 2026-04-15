import { A3Card } from './A3Card';
import { LoadingSpinner } from '../LoadingSpinner';

export const A3CardList = ({ a3s, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="py-12">
        <LoadingSpinner label="Cargando A3s..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center">
        <p className="font-semibold">❌ Error al cargar A3s</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!a3s || a3s.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-12 rounded-lg text-center">
        <p className="text-lg font-semibold">📭 No hay A3s para mostrar</p>
        <p className="text-sm mt-1">Crea una nueva A3 para comenzar</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {a3s.map((a3) => (
        <A3Card key={a3.id} a3={a3} />
      ))}
    </div>
  );
};
