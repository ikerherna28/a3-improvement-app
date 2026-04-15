import { useMemo } from 'react';
import { IAAssistantButton } from './IAAssistantButton';

const ESTADOS_A3 = [
  'abierto',
  'en_curso',
  'pendiente',
  'cerrado',
];

const emptyPlanRow = {
  accion: '',
  responsable: '',
  fechaCompromiso: '',
  estado: 'pendiente',
};

export const createEmptyPlanRow = () => ({ ...emptyPlanRow });

export const A3FormStep = ({
  values,
  errors,
  onChange,
  onPlanRowChange,
  onAddPlanRow,
  onRemovePlanRow,
  onSave,
  onCancel,
  onBack,
  onNext,
  canContinue,
  aiLoadingField,
  aiModes = {},
  onGenerateAi,
  onToggleAiEdit,
}) => {
  const planRows = useMemo(() => values.planAccion || [], [values.planAccion]);

  const renderAiField = ({
    field,
    label,
    rows = 3,
    placeholder,
    helperText,
    wrapperClassName = 'md:col-span-2',
    textareaClassName = '',
  }) => {
    const isLocked = aiModes[field] === 'locked';
    const isLoading = aiLoadingField === field;

    return (
      <div className={wrapperClassName}>
        <div className="flex items-center justify-between gap-3 mb-2">
          <label className="block text-sm font-semibold text-gray-700">{label}</label>
          <div className="flex items-center gap-2">
            <IAAssistantButton
              onClick={() => onGenerateAi(field)}
              isLoading={isLoading}
              disabled={isLoading}
              label="Generar con IA"
            />
            {values[field] && (
              <button
                type="button"
                onClick={() => onToggleAiEdit(field)}
                className="px-3 py-2 rounded-md text-sm font-semibold bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
              >
                {isLocked ? 'Editar' : 'Bloquear'}
              </button>
            )}
          </div>
        </div>
        <textarea
          rows={rows}
          value={values[field]}
          onChange={(e) => onChange(field, e.target.value)}
          placeholder={placeholder}
          readOnly={isLocked}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            errors[field] ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-purple-200'
          } ${isLocked ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'} ${textareaClassName}`}
        />
        {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
        {errors[field] && <p className="text-xs text-red-600 mt-1">{errors[field]}</p>}
      </div>
    );
  };

  return (
    <div className="space-y-6 transition-all duration-300 ease-out">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Paso 2: Formulario A3</h2>
        <p className="text-sm text-gray-600 mb-6">
          Completa la informacion del A3 con datos editables y plan de accion.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre mejora</label>
            <input
              type="text"
              value={values.nombreMejora}
              onChange={(e) => onChange('nombreMejora', e.target.value)}
              placeholder="Ej. Reduccion de defectos en L2"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.nombreMejora ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-purple-200'
              }`}
            />
            {errors.nombreMejora && <p className="text-xs text-red-600 mt-1">{errors.nombreMejora}</p>}
          </div>

          {renderAiField({
            field: 'antecedentes',
            label: 'Antecedentes',
            rows: 3,
            placeholder: 'Describe el contexto historico del problema.',
            helperText: 'Usa IA para generar un borrador inicial y luego ajustalo manualmente.',
          })}

          {renderAiField({
            field: 'situacionActual',
            label: 'Situacion actual (Pareto automatico)',
            rows: 4,
            placeholder: 'Resumen generado desde Pareto',
            helperText: 'Se autocompleta tras generar Pareto, pero puedes editarlo.',
          })}

          {renderAiField({
            field: 'analisisProblema',
            label: 'Analisis problema',
            rows: 3,
            placeholder: 'Que esta fallando y como impacta el proceso.',
            helperText: 'La IA puede ayudarte a resumir el problema con foco A3.',
          })}

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Objetivo</label>
            <textarea
              rows={2}
              value={values.objetivo}
              onChange={(e) => onChange('objetivo', e.target.value)}
              placeholder="Ej. Reducir el defecto X del 12% al 5% en 60 dias."
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.objetivo ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-purple-200'
              }`}
            />
            {errors.objetivo && <p className="text-xs text-red-600 mt-1">{errors.objetivo}</p>}
          </div>

          {renderAiField({
            field: 'analisisCausaRaiz',
            label: 'Analisis causa raiz',
            rows: 3,
            placeholder: 'Describe causas raiz validadas (5 Why, Ishikawa, etc.).',
            helperText: 'Genera una propuesta de causa raiz basada en el Pareto.',
          })}

          {renderAiField({
            field: 'planAccionResumen',
            label: 'Plan accion sugerido por IA',
            rows: 3,
            placeholder: 'Sugerencia textual de acciones y prioridades.',
            helperText: 'Este texto ayuda a redactar la tabla editable de plan de accion.',
          })}

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Plan accion (tabla editable)</label>
            <p className="text-xs text-gray-500 mb-3">
              La sugerencia de IA no reemplaza la tabla; sirve como base para completar las acciones.
            </p>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="text-left px-3 py-2 font-semibold">Accion</th>
                    <th className="text-left px-3 py-2 font-semibold">Responsable</th>
                    <th className="text-left px-3 py-2 font-semibold">Fecha compromiso</th>
                    <th className="text-left px-3 py-2 font-semibold">Estado</th>
                    <th className="text-left px-3 py-2 font-semibold">Quitar</th>
                  </tr>
                </thead>
                <tbody>
                  {planRows.map((row, index) => (
                    <tr key={`plan-row-${index}`} className="border-t border-gray-200">
                      <td className="px-3 py-2 min-w-[220px]">
                        <input
                          type="text"
                          value={row.accion}
                          onChange={(e) => onPlanRowChange(index, 'accion', e.target.value)}
                          placeholder="Accion"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200"
                        />
                      </td>
                      <td className="px-3 py-2 min-w-[180px]">
                        <input
                          type="text"
                          value={row.responsable}
                          onChange={(e) => onPlanRowChange(index, 'responsable', e.target.value)}
                          placeholder="Responsable"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200"
                        />
                      </td>
                      <td className="px-3 py-2 min-w-[180px]">
                        <input
                          type="date"
                          value={row.fechaCompromiso}
                          onChange={(e) => onPlanRowChange(index, 'fechaCompromiso', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200"
                        />
                      </td>
                      <td className="px-3 py-2 min-w-[150px]">
                        <select
                          value={row.estado}
                          onChange={(e) => onPlanRowChange(index, 'estado', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="en_curso">En curso</option>
                          <option value="completada">Completada</option>
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => onRemovePlanRow(index)}
                          disabled={planRows.length <= 1}
                          className="px-3 py-2 text-red-700 bg-red-50 hover:bg-red-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {errors.planAccion && <p className="text-xs text-red-600 mt-1">{errors.planAccion}</p>}

            <button
              type="button"
              onClick={onAddPlanRow}
              className="mt-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-medium transition-colors"
            >
              + Agregar fila
            </button>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Estandarizacion</label>
            <textarea
              rows={3}
              value={values.estandarizacion}
              onChange={(e) => onChange('estandarizacion', e.target.value)}
              placeholder="Como se sostendra la mejora en el tiempo."
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.estandarizacion ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-purple-200'
              }`}
            />
            {errors.estandarizacion && <p className="text-xs text-red-600 mt-1">{errors.estandarizacion}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
            <select
              value={values.estado}
              onChange={(e) => onChange('estado', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.estado ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-purple-200'
              }`}
            >
              {ESTADOS_A3.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
            {errors.estado && <p className="text-xs text-red-600 mt-1">{errors.estado}</p>}
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onSave}
            className="px-6 py-3 bg-corporate-purple hover:bg-purple-800 text-white rounded-lg font-semibold transition-colors"
          >
            Guardar borrador
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold transition-colors"
          >
            Volver al paso 1
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!canContinue}
            className="px-6 py-3 bg-corporate-orange hover:bg-orange-600 text-white rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Continuar al paso 3
          </button>
        </div>
      </div>
    </div>
  );
};
