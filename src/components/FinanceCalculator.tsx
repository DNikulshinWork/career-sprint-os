import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle, 
  DollarSign, 
  Clock, 
  PieChart,
  ArrowRight,
  Info
} from 'lucide-react';

export const FinanceCalculator: React.FC = () => {
  const [hourlyRate, setHourlyRate] = useState<number>(2000);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(18);
  const [targetFulltimeSalary, setTargetFulltimeSalary] = useState<number>(250000);
  const [monthlyLivingExpenses, setMonthlyLivingExpenses] = useState<number>(100000);

  // Calculations
  const weeksPerMonth = 4.33;
  const grossMonthlySideIncome = Math.round(hourlyRate * hoursPerWeek * weeksPerMonth);
  const taxRate = 0.06; // 6% НПД (Самозанятый при работе с юрлицами)
  const taxes = Math.round(grossMonthlySideIncome * taxRate);
  const netMonthlySideIncome = grossMonthlySideIncome - taxes;

  // Cushion metrics
  const safetyCushionTarget = monthlyLivingExpenses * 3; // 3 months
  const monthsToBuildCushion = Math.ceil(safetyCushionTarget / netMonthlySideIncome);

  // Transition safety score
  const sideIncomeCoveragePercent = Math.min(100, Math.round((netMonthlySideIncome / monthlyLivingExpenses) * 100));

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Калькулятор Перехода: Part-Time Доход & Подушка Безопасности
            </h3>
            <p className="text-xs text-slate-400">
              Рассчитай реальную математику совмещения: сколько принесет частичная занятость и когда безопасно переходить на Full-Time.
            </p>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-3">
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-mono">Налог самозанятого:</div>
            <div className="text-xs font-bold text-cyan-400 font-mono">6% (НПД с юрлицами)</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders and Controls (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Параметры твоей рабочей модели
          </h4>

          {/* Rate slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                <span>Твоя часовая ставка (Part-time / B2B):</span>
              </span>
              <span className="text-base font-bold text-white font-mono">
                {hourlyRate.toLocaleString()} ₽ / час
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={4000}
              step={100}
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 000 ₽ (Минимум)</span>
              <span className="text-cyan-400 font-semibold">2 000 ₽ (Оптимум Middle+)</span>
              <span>4 000 ₽ (Senior / B2B)</span>
            </div>
          </div>

          {/* Hours per week */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Часов в неделю на разработку (подработка):</span>
              </span>
              <span className="text-base font-bold text-cyan-400 font-mono">
                {hoursPerWeek} ч / нед (~{(hoursPerWeek / 5).toFixed(1)} ч/день)
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={30}
              step={2}
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10 ч (Легкий темп)</span>
              <span className="text-cyan-400 font-semibold">18–20 ч (Стандарт Part-time)</span>
              <span>30 ч (Плотная нагрузка)</span>
            </div>
          </div>

          {/* Monthly living expenses */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Базовые расходы на жизнь в месяц:</span>
              <span className="text-sm font-bold text-slate-200 font-mono">
                {monthlyLivingExpenses.toLocaleString()} ₽
              </span>
            </div>
            <input
              type="range"
              min={50000}
              max={250000}
              step={10000}
              value={monthlyLivingExpenses}
              onChange={(e) => setMonthlyLivingExpenses(Number(e.target.value))}
              className="w-full accent-slate-500 cursor-pointer"
            />
          </div>

          {/* Full-time target salary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Целевая зарплата на Full-time Remote:</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                {targetFulltimeSalary.toLocaleString()} ₽ / мес
              </span>
            </div>
            <input
              type="range"
              min={180000}
              max={350000}
              step={10000}
              value={targetFulltimeSalary}
              onChange={(e) => setTargetFulltimeSalary(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Calculated Results (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>Финансовые итоги модели</span>
            </div>

            {/* Main side income block */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400">Чистый дополнительный доход в месяц:</div>
              <div className="text-3xl font-black text-cyan-400 font-mono mt-1">
                +{netMonthlySideIncome.toLocaleString()} ₽
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <span>(Гросс: {grossMonthlySideIncome.toLocaleString()} ₽)</span>
                <span>• Налог НПД: -{taxes.toLocaleString()} ₽</span>
              </div>
            </div>

            {/* Grid of indicators */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                <div className="text-[11px] text-slate-400">Покрытие расходов подработкой:</div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                  {sideIncomeCoveragePercent}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  от твоих ежемесячных трат
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                <div className="text-[11px] text-slate-400">Подушка на 3 месяца:</div>
                <div className="text-xl font-bold font-mono text-amber-400 mt-1">
                  ~{monthsToBuildCushion} {monthsToBuildCushion === 1 ? 'месяц' : monthsToBuildCushion < 5 ? 'месяца' : 'месяцев'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  цель: {safetyCushionTarget.toLocaleString()} ₽
                </div>
              </div>
            </div>

            {/* Transition readiness indicator */}
            <div className="bg-slate-950 border border-cyan-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Индекс безопасности перехода:</span>
                </span>
                <span className="font-mono font-bold text-emerald-400">{sideIncomeCoveragePercent > 80 ? 'ВЫСОКИЙ' : 'УМЕРЕННЫЙ'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {sideIncomeCoveragePercent >= 100 
                  ? '🔥 Твой дополнительный доход полностью перекрывает все расходы на жизнь! Переход на full-time remote полностью безопасен, у тебя нет финансового давления.'
                  : `Дополнительный доход закрывает ${sideIncomeCoveragePercent}% расходов. Рекомендуется отработать в режиме part-time 1–2 месяца, сформировать подушку в ${safetyCushionTarget.toLocaleString()} ₽ и только затем уходить на Full-Time.`}
              </p>
            </div>

            {/* Full-time comparison */}
            <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Целевой Full-time доход:</span>
              <span className="font-mono font-bold text-white text-sm">
                {targetFulltimeSalary.toLocaleString()} ₽ / мес (~{(targetFulltimeSalary * 12 / 1000000).toFixed(2)} млн ₽/год)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
