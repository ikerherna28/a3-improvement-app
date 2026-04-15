import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Alert } from '../components/Alert';
import { A3StepIndicator } from '../components/a3creator/A3StepIndicator';
import { DataSelectionStep } from '../components/a3creator/DataSelectionStep';
import { A3FormStep, createEmptyPlanRow } from '../components/a3creator/A3FormStep';
import { aiService, dataService } from '../services/api';

const STEPS = [
  {
    id: 'data-selection',
    label: 'Seleccion de datos',
    description: 'Filtros y Pareto base',
  },
  {
    id: 'problem-definition',
    label: 'Definir problema',
    description: 'Contexto y alcance',
  },
  {
    id: 'actions',
    label: 'Plan de accion',
    description: 'Contramedidas y seguimiento',
  },
];

const initialForm = {
  linea: '',
  categoria: '',
  fechaDesde: '',
  fechaHasta: '',
  nombreMejora: '',
  antecedentes: '',
  situacionActual: '',
  analisisProblema: '',
  objetivo: '',
  analisisCausaRaiz: '',
  planAccionResumen: '',
  planAccion: [createEmptyPlanRow()],
  estandarizacion: '',
  estado: 'abierto',
};

const DRAFT_KEY = 'a3CreatorDraftV1';
const step2ErrorKeys = [
  'nombreMejora',
  'antecedentes',
  'situacionActual',
  'analisisProblema',
  'objetivo',
  'analisisCausaRaiz',
  'planAccionResumen',
  'planAccion',
  'estandarizacion',
  'estado',
];

const INITIAL_AI_MODES = {
  antecedentes: 'editable',
  situacionActual: 'editable',
  analisisProblema: 'editable',
  analisisCausaRaiz: 'editable',
  planAccionResumen: 'editable',
};

const buildParetoSummary = (items, linea, fechaDesde, fechaHasta) => {
  if (!items?.length) {
    return '';
  }

  const topItems = items.slice(0, 3);
  const topText = topItems
    .map((item, index) => {
      const problema = item.causa || 'Sin causa';
      const total = item.total || 0;
      const acc = Number(item.accumulatedPercentage || 0).toFixed(2);
      return `${index + 1}. ${problema} (${total}) - Acum: ${acc}%`;
    })
    .join(' | ');

  return `Linea: ${linea}. Periodo: ${fechaDesde} a ${fechaHasta}. Top Pareto: ${topText}.`;
};

export const A3CreatorPage = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isLoadingPareto, setIsLoadingPareto] = useState(false);
  const [aiLoadingField, setAiLoadingField] = useState(null);
  const [aiModes, setAiModes] = useState(INITIAL_AI_MODES);
  const [paretoData, setParetoData] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    try {
      const rawDraft = localStorage.getItem(DRAFT_KEY);
      if (!rawDraft) {
        return;
      }

      const draft = JSON.parse(rawDraft);
      if (draft?.formData) {
        setFormData((prev) => ({
          ...prev,
          ...draft.formData,
          planAccion: Array.isArray(draft.formData.planAccion) && draft.formData.planAccion.length
            ? draft.formData.planAccion
            : [createEmptyPlanRow()],
        }));
      }

      if (draft?.aiModes) {
        setAiModes((prev) => ({
          ...prev,
          ...draft.aiModes,
        }));
      }

      if (Array.isArray(draft?.paretoData)) {
        setParetoData(draft.paretoData);
      }

      if (typeof draft?.currentStep === 'number') {
        setCurrentStep(Math.min(Math.max(draft.currentStep, 1), STEPS.length));
      }
    } catch (error) {
      console.error('No se pudo cargar borrador A3:', error);
    }
  }, []);

  useEffect(() => {
    const payload = {
      currentStep,
      formData,
      aiModes,
      paretoData,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
  }, [currentStep, formData, aiModes, paretoData]);

  const canGoNext = useMemo(() => {
    if (currentStep === 1) {
      return paretoData.length > 0;
    }
    if (currentStep === 2) {
      return true;
    }
    return true;
  }, [currentStep, paretoData.length]);

  const updateFormValue = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const buildAiContext = (field) => {
    const paretoTop = paretoData.slice(0, 5).map((item, index) => ({
      rank: index + 1,
      causa: item.causa || 'Sin causa',
      total: item.total || 0,
      acumulado: Number(item.accumulatedPercentage || 0).toFixed(2),
    }));

    return JSON.stringify(
      {
        campoObjetivo: field,
        nombreMejora: formData.nombreMejora,
        linea: formData.linea,
        categoria: formData.categoria,
        fechaDesde: formData.fechaDesde,
        fechaHasta: formData.fechaHasta,
        antecedentes: formData.antecedentes,
        situacionActual: formData.situacionActual,
        analisisProblema: formData.analisisProblema,
        objetivo: formData.objetivo,
        analisisCausaRaiz: formData.analisisCausaRaiz,
        planAccionResumen: formData.planAccionResumen,
        estandarizacion: formData.estandarizacion,
        paretoTop,
      },
      null,
      2
    );
  };

  const handleToggleAiEdit = (field) => {
    setAiModes((prev) => ({
      ...prev,
      [field]: prev[field] === 'locked' ? 'editable' : 'locked',
    }));
  };

  const handleGenerateAi = async (field) => {
    const requestMap = {
      antecedentes: aiService.generateAnalisis,
      situacionActual: aiService.generateAnalisis,
      analisisProblema: aiService.generateAnalisis,
      analisisCausaRaiz: aiService.generateCausaRaiz,
      planAccionResumen: aiService.generatePlanAccion,
    };

    const labelMap = {
      antecedentes: 'antecedentes',
      situacionActual: 'situacion actual',
      analisisProblema: 'analisis del problema',
      analisisCausaRaiz: 'analisis de causa raiz',
      planAccionResumen: 'plan de accion',
    };

    const request = requestMap[field];
    if (!request) {
      return;
    }

    try {
      setAiLoadingField(field);
      setAlert({
        type: 'info',
        message: `Generando ${labelMap[field] || field} con IA...`,
      });

      const params = {
        area: formData.linea,
        dateFrom: formData.fechaDesde ? new Date(formData.fechaDesde).toISOString() : undefined,
        dateTo: formData.fechaHasta ? new Date(`${formData.fechaHasta}T23:59:59`).toISOString() : undefined,
        top: 10,
        contexto: buildAiContext(field),
      };

      const { data } = await request(params);
      const generatedText = data?.texto || '';

      updateFormValue(field, generatedText);
      setAiModes((prev) => ({
        ...prev,
        [field]: 'locked',
      }));

      setAlert({
        type: 'success',
        message: `${labelMap[field] || field} generado correctamente con IA.`,
      });
    } catch (error) {
      console.error('Error generando con IA:', error);
      setAlert({
        type: 'error',
        message: error?.response?.data?.message || 'No fue posible generar contenido con IA.',
      });
    } finally {
      setAiLoadingField(null);
    }
  };

  const updatePlanRow = (index, field, value) => {
    setFormData((prev) => {
      const nextRows = [...prev.planAccion];
      nextRows[index] = {
        ...nextRows[index],
        [field]: value,
      };

      return {
        ...prev,
        planAccion: nextRows,
      };
    });

    setErrors((prev) => ({ ...prev, planAccion: undefined }));
  };

  const addPlanRow = () => {
    setFormData((prev) => ({
      ...prev,
      planAccion: [...prev.planAccion, createEmptyPlanRow()],
    }));
  };

  const removePlanRow = (index) => {
    setFormData((prev) => {
      if (prev.planAccion.length <= 1) {
        return prev;
      }

      return {
        ...prev,
        planAccion: prev.planAccion.filter((_, rowIndex) => rowIndex !== index),
      };
    });
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.linea) {
      newErrors.linea = 'Selecciona una linea.';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'Selecciona una categoria.';
    }

    if (!formData.fechaDesde) {
      newErrors.fechaDesde = 'Selecciona la fecha inicial.';
    }

    if (!formData.fechaHasta) {
      newErrors.fechaHasta = 'Selecciona la fecha final.';
    }

    if (formData.fechaDesde && formData.fechaHasta && formData.fechaDesde > formData.fechaHasta) {
      newErrors.fechaHasta = 'La fecha final debe ser mayor o igual que la inicial.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGeneratePareto = async () => {
    if (!validateStep1()) {
      setAlert({
        type: 'error',
        message: 'Corrige los campos marcados para generar el Pareto.',
      });
      return;
    }

    try {
      setAlert(null);
      setIsLoadingPareto(true);

      const params = {
        area: formData.linea,
        dateFrom: new Date(formData.fechaDesde).toISOString(),
        dateTo: new Date(`${formData.fechaHasta}T23:59:59`).toISOString(),
        top: 10,
      };

      const { data } = await dataService.getPareto(params);
      const items = Array.isArray(data?.items) ? data.items : [];

      setParetoData(items);
      if (items.length > 0) {
        updateFormValue('situacionActual', buildParetoSummary(items, formData.linea, formData.fechaDesde, formData.fechaHasta));
      }

      if (items.length === 0) {
        setAlert({
          type: 'warning',
          message: 'No se encontraron datos para los filtros seleccionados.',
        });
      } else {
        setAlert({
          type: 'success',
          message: `Pareto generado con ${items.length} problema(s).`,
        });
      }
    } catch (error) {
      console.error('Error al generar Pareto:', error);
      setParetoData([]);
      setAlert({
        type: 'error',
        message: error?.response?.data?.message || 'No fue posible generar el Pareto.',
      });
    } finally {
      setIsLoadingPareto(false);
    }
  };

  const validateStep2 = () => {
    const nextErrors = {};

    if (!formData.nombreMejora.trim()) {
      nextErrors.nombreMejora = 'El nombre de mejora es obligatorio.';
    }

    if (!formData.antecedentes.trim()) {
      nextErrors.antecedentes = 'Describe los antecedentes.';
    }

    if (!formData.situacionActual.trim()) {
      nextErrors.situacionActual = 'La situacion actual es obligatoria.';
    }

    if (!formData.analisisProblema.trim()) {
      nextErrors.analisisProblema = 'Completa el analisis del problema.';
    }

    if (!formData.objetivo.trim()) {
      nextErrors.objetivo = 'Define el objetivo.';
    }

    if (!formData.analisisCausaRaiz.trim()) {
      nextErrors.analisisCausaRaiz = 'Completa el analisis de causa raiz.';
    }

    if (!formData.estandarizacion.trim()) {
      nextErrors.estandarizacion = 'Define como estandarizaras la mejora.';
    }

    if (!formData.estado) {
      nextErrors.estado = 'Selecciona un estado.';
    }

    const hasValidPlanRow = formData.planAccion.some(
      (row) => row.accion.trim() && row.responsable.trim() && row.fechaCompromiso
    );

    if (!hasValidPlanRow) {
      nextErrors.planAccion = 'Agrega al menos una fila de plan de accion completa.';
    }

    setErrors((prev) => {
      const cleanPrev = { ...prev };
      for (const key of step2ErrorKeys) {
        delete cleanPrev[key];
      }

      return { ...cleanPrev, ...nextErrors };
    });
    return Object.keys(nextErrors).length === 0;
  };

  const handleSaveDraft = () => {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        currentStep,
        formData,
        aiModes,
        paretoData,
        updatedAt: new Date().toISOString(),
      })
    );

    setAlert({
      type: 'success',
      message: 'Borrador A3 guardado correctamente.',
    });
  };

  const handleCancelStep2 = () => {
    setFormData((prev) => ({
      ...prev,
      nombreMejora: '',
      antecedentes: '',
      situacionActual: buildParetoSummary(paretoData, formData.linea, formData.fechaDesde, formData.fechaHasta),
      analisisProblema: '',
      objetivo: '',
      analisisCausaRaiz: '',
      planAccionResumen: '',
      planAccion: [createEmptyPlanRow()],
      estandarizacion: '',
      estado: 'abierto',
    }));

    setAiLoadingField(null);
    setAiModes(INITIAL_AI_MODES);

    setErrors({});
    setAlert({
      type: 'info',
      message: 'Formulario del paso 2 reiniciado.',
    });
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !canGoNext) {
      setAlert({
        type: 'warning',
        message: 'Genera el Pareto antes de continuar al siguiente paso.',
      });
      return;
    }

    if (currentStep === 2) {
      const isValidStep2 = validateStep2();
      if (!isValidStep2) {
        setAlert({
          type: 'error',
          message: 'Completa los campos obligatorios del formulario A3.',
        });
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handlePrevStep = () => {
    if (currentStep === 1) {
      navigate('/dashboard');
      return;
    }

    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderCurrentStep = () => {
    if (currentStep === 1) {
      return (
        <DataSelectionStep
          values={formData}
          errors={errors}
          isLoading={isLoadingPareto}
          paretoData={paretoData}
          onChange={updateFormValue}
          onGeneratePareto={handleGeneratePareto}
          onNext={handleNextStep}
          onBack={handlePrevStep}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <A3FormStep
          values={formData}
          errors={errors}
          onChange={updateFormValue}
          onPlanRowChange={updatePlanRow}
          onAddPlanRow={addPlanRow}
          onRemovePlanRow={removePlanRow}
          onSave={handleSaveDraft}
          onCancel={handleCancelStep2}
          onBack={handlePrevStep}
          onNext={handleNextStep}
          canContinue={true}
          aiLoadingField={aiLoadingField}
          aiModes={aiModes}
          onGenerateAi={handleGenerateAi}
          onToggleAiEdit={handleToggleAiEdit}
        />
      );
    }

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Paso 3: Plan de accion</h2>
        <p className="text-gray-600 mb-6">
          Este paso se implementara en la siguiente fase del Prompt Maestro A3.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handlePrevStep}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold"
          >
            Volver
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-corporate-purple hover:bg-purple-800 text-white rounded-lg font-semibold"
          >
            Finalizar borrador A3
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-corporate-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-corporate-purple">Creador A3</h1>
            <p className="text-gray-600 mt-1">
              Flujo guiado para construir tu A3 en pasos.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold"
          >
            Cancelar
          </button>
        </div>

        <A3StepIndicator
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={(step) => {
            if (step <= currentStep || (step === 2 && paretoData.length > 0)) {
              setCurrentStep(step);
            }
          }}
        />

        {alert && (
          <Alert
            type={alert.type}
            title={alert.title}
            message={alert.message || alert.text}
            onClose={() => setAlert(null)}
          />
        )}

        {renderCurrentStep()}
      </main>

      <Footer />
    </div>
  );
};
