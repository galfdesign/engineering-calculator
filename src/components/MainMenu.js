import React, { useState } from 'react';
import './FlowCalculator.css';

const MenuContainer = (props) => (
  <div className="container" style={{marginTop: 0}}>{props.children}</div>
);

const MainMenu = ({ onShowCalculator }) => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menuId) => {
    setOpenMenu(openMenu === menuId ? null : menuId);
  };

  const menuItems = {
    hydraulic: {
      title: 'Гидравлика',
      color: '#E3F2FD', // Светло-голубой
      items: [
        { title: 'Расход жидкости по мощности', url: '', id: 'flowCalculator' },
        { title: 'Расход жидкости по диаметру', url: '', id: 'flowByDiameterCalculator' },
        { title: 'Скорость жидкости', url: '', id: 'liquidSpeedCalculator' },
        { title: 'Гидравлическое сопротивление', url: '', id: 'hydraulicResistanceCalculator' },
      ],
    },
    heating: {
      title: 'Отопление',
      color: '#F3E5F5', // Светло-фиолетовый
      items: [
        { title: 'Подбор насоса', url: '', id: 'pumpSelectionCalculator' },
        { title: 'Подбор радиаторов', url: '', id: 'radiatorCalculator' },
        { title: 'Расширительный бак отопления', url: '', id: 'expansionTankCalculator' },
      ],
    },
    cost: {
      title: 'Стоимость',
      color: '#E8F5E9', // Светло-зеленый
      items: [
        { title: 'Подогрев вентиляции', url: '', id: 'ventilationHeatingCalculator' },
        // { title: 'Затраты на отопление (тест)', url: '', id: 'fuelCostCalculator' },
      ],
    },
    processes: {
      title: 'Процессы',
      color: '#FFEBEE', // Светло-красный
      items: [
        { title: 'Тепловой поток от плиты', url: '', id: 'plateHeatFlowCalculator' },
        { title: 'Напольное отопление', url: '', id: 'newProcessCalculator' }
      ],
    },
    // reference: {
    //   title: 'Справочник',
    //   color: '#FFF3E0', // Светло-оранжевый
    //   items: [
    //     { title: 'Строительная климатология', url: '', id: 'buildingClimatology' },
    //   ],
    // },
  };

  return (
    <MenuContainer>
      <div style={{display: 'flex', justifyContent: 'center', marginBottom: 18, marginTop: 10}}>
        <span style={{
          fontWeight: 600,
          fontSize: 18,
          color: '#8a8a8a',
          letterSpacing: '0.03em',
          fontFamily: "'Roboto', sans-serif",
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          Инженерные калькуляторы
        </span>
      </div>
      {Object.entries(menuItems).map(([key, menu]) => (
        <div key={key} style={{marginBottom: 18}}>
          <button
            className={`toggle-option${openMenu === key ? ' active' : ''}`}
            style={{
              width: '100%',
              fontSize: '1.25em',
              justifyContent: 'space-between',
              background: menu.color,
              color: '#2c3e50',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 16px',
              transition: 'all 0.2s ease',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(30,60,120,0.06)'
            }}
            onClick={() => toggleMenu(key)}
          >
            {menu.title} <span style={{float: 'right', fontSize: '0.9em', marginLeft: 8}}>{openMenu === key ? '▲' : '▼'}</span>
          </button>
          {openMenu === key && (
            <div style={{marginTop: 10}}>
              {menu.items.map((item) => (
                <button
                  key={item.id}
                  className="toggle-option"
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    marginBottom: 7,
                    fontWeight: 500,
                    fontSize: '1.15em',
                    borderRadius: 10,
                    background: 'var(--toggle-bg)',
                    color: 'var(--input-text)',
                    border: '1.5px solid var(--border)',
                    padding: '12px 16px',
                    transition: 'background 0.18s, color 0.18s',
                  }}
                  onClick={() => onShowCalculator(item.id, item.title, item.url)}
                >
                  {item.title}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </MenuContainer>
  );
};

export default MainMenu; 