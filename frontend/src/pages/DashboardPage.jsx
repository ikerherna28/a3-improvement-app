import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { A3CardList } from '../components/dashboard/A3CardList';
import { StatusFilter } from '../components/dashboard/StatusFilter';
import { a3Service } from '../services/api';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [a3s, setA3s] = useState([]);
  const [filteredA3s, setFilteredA3s] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    abierto: 0,
    en_curso: 0,
    pendiente: 0,
    cerrado: 0,
  });

  // Cargar A3s del backend
  useEffect(() => {
    const loadA3s = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await a3Service.getAll();
        
        // Asumiendo que el backend retorna { data: [...] } o directamente un array
        const a3Data = Array.isArray(response.data) ? response.data : response.data.data || [];
        
        setA3s(a3Data);
        
        // Calcular estadísticas
        const newStats = {
          total: a3Data.length,
          abierto: a3Data.filter(a => a.status === 'abierto').length,
          en_curso: a3Data.filter(a => a.status === 'en_curso').length,
          pendiente: a3Data.filter(a => a.status === 'pendiente').length,
          cerrado: a3Data.filter(a => a.status === 'cerrado').length,
        };
        setStats(newStats);
        
        // Filtrar por estado inicial
        filterA3sByStatus(a3Data, 'all');
      } catch (err) {
        console.error('Error al cargar A3s:', err);
        setError(err.response?.data?.message || 'Error al cargar A3s. Intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    loadA3s();
  }, []);

  // Filtrar A3s por estado
  const filterA3sByStatus = (dataToFilter, status) => {
    setSelectedStatus(status);
    
    if (status === 'all') {
      setFilteredA3s(dataToFilter);
    } else {
      setFilteredA3s(dataToFilter.filter(a3 => a3.status === status));
    }
  };

  // Manejar cambio de filtro
  const handleStatusChange = (status) => {
    filterA3sByStatus(a3s, status);
  };

  // Crear nueva A3
  const handleCreateA3 = () => {
    navigate('/a3/new'); // Ruta a crear
  };

  return (
    <div className="min-h-screen bg-corporate-background flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {/* Título y botón */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-corporate-purple">Dashboard</h1>
            <p className="text-gray-600 mt-1">Visualiza y gestiona todas tus A3s</p>
          </div>
          <button
            onClick={handleCreateA3}
            className="bg-corporate-orange hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
          >
            ➕ Nueva A3
          </button>
        </div>

        {/* Estadísticas */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Estadísticas</h2>
          <DashboardStats stats={stats} />
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtrar por estado</h2>
          <StatusFilter 
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
            stats={stats}
          />
        </div>

        {/* Lista de A3s */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedStatus === 'all' 
                ? `Todas las A3s (${filteredA3s.length})` 
                : `A3s ${selectedStatus === 'en_curso' ? 'En Curso' : selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} (${filteredA3s.length})`
              }
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {filteredA3s.length === 0 
                ? 'No hay A3s para mostrar en este estado' 
                : `Mostrando ${filteredA3s.length} ${filteredA3s.length === 1 ? 'A3' : 'A3s'}`
              }
            </p>
          </div>
          
          <A3CardList 
            a3s={filteredA3s} 
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Sección de información */}
        {filteredA3s.length === 0 && !isLoading && !error && (
          <div className="mt-12 bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">No hay A3s</h3>
              <p className="text-gray-600 mb-6">Crea tu primera A3 para comenzar a gestionar mejoras continuas.</p>
              <button
                onClick={handleCreateA3}
                className="bg-corporate-purple hover:bg-purple-900 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
              >
                Crear primera A3
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
