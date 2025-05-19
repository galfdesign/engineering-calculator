import React, { useState } from 'react';
import './FlowCalculator.css';

const MenuContainer = (props) => (
  <div className="container" style={{marginTop: 0}}>{props.children}</div>
);

const MenuCard = (props) => (
  <div className="card" style={{marginBottom: 18}}>{props.children}</div>
);

const MainMenu = ({ onShowCalculator }) => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menuId) => {
    setOpenMenu(openMenu === menuId ? null : menuId);
  };

  const menuItems = {
    hydraulic: {
      title: 'Гидравлика',
      items: [
        {
          title: 'Скорость жидкости',
          url: 'https://galfdesign.github.io/gidskg/',
          id: 'speedPage',
        },
        {
          title: 'Расход жидкости по мощности',
          url: '',
          id: 'flowCalculator',
        },
        {
          title: 'Расход жидкости по диаметру',
          url: 'https://galfdesign.github.io/giddiametr/',
          id: 'diameterPage',
        },
        {
          title: 'Гидравлическое сопротивление',
          url: 'https://galfdesign.github.io/gidsoprotjvl/',
          id: 'resistancePage',
        },
      ],
    },
    heating: {
      title: 'Отопление',
      items: [
        {
          title: 'Подбор насоса',
          url: 'https://galfdesign.github.io/soprtrub/',
          id: 'pumpPage',
        },
        {
          title: 'Температура внутренней поверхности',
          url: '#',
          id: 'tempPage',
        },
        {
          title: 'Сопротивление материалов',
          url: '#',
          id: 'resistancePage',
        },
      ],
    },
  };

  return (
    <MenuContainer>
      <div className="header-row" style={{justifyContent: 'space-between', marginBottom: 24}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <img src="/galfdesign-logo.png" alt="GalfDesign" style={{height: 28, width: 'auto', display: 'block'}} />
        </div>
        <div className="card-title" style={{fontSize: '1.35em', flex: 1, textAlign: 'right', color: '#8a8a8a'}}>калькуляторы</div>
      </div>
      {Object.entries(menuItems).map(([key, menu]) => (
        <MenuCard key={key}>
          <div className="toggle-row" style={{marginBottom: 0}}>
            <button
              className={`toggle-option${openMenu === key ? ' active' : ''}`}
              style={{width: '100%', fontSize: '1.08em', justifyContent: 'space-between'}}
              onClick={() => toggleMenu(key)}
            >
              {menu.title} <span style={{float: 'right', fontSize: '0.9em', marginLeft: 8}}>{openMenu === key ? '▲' : '▼'}</span>
            </button>
          </div>
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
                    fontSize: '1em',
                    borderRadius: 10,
                    background: 'var(--toggle-bg)',
                    color: 'var(--input-text)',
                    border: '1.5px solid var(--border)',
                    padding: '10px 16px',
                    transition: 'background 0.18s, color 0.18s',
                  }}
                  onClick={() => onShowCalculator(item.id, item.title, item.url)}
                >
                  {item.title}
                </button>
              ))}
            </div>
          )}
        </MenuCard>
      ))}
    </MenuContainer>
  );
};

export default MainMenu; 