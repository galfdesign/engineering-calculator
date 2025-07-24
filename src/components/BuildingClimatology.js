import React, { useState, useEffect } from 'react';
import './FlowCalculator.css';

const CLIMATE_DATA = {
  "Адыгея": {
    "Адыгейск": { degreeDays: 3490, coldFiveDayTemp: -18, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Майкоп": { degreeDays: 3500, coldFiveDayTemp: -19, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Алтайский край": {
    "Барнаул": { degreeDays: 5830, coldFiveDayTemp: -37, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Бийск": { degreeDays: 5930, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Змеиногорск": { degreeDays: 6060, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Камень-на-Оби": { degreeDays: 6020, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Рубцовск": { degreeDays: 6040, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Белокуриха": { degreeDays: 5740, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Горно-Алтайск": { degreeDays: 5700, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Заринск": { degreeDays: 5810, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Кулунда": { degreeDays: 6000, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Славгород": { degreeDays: 6050, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Тогул": { degreeDays: 6070, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Яровое": { degreeDays: 5970, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Амурская область": {
    "Архара": { degreeDays: 6080, coldFiveDayTemp: -39, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ерофей Павлович": { degreeDays: 7210, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Завитинск": { degreeDays: 6120, coldFiveDayTemp: -39, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Магдагачи": { degreeDays: 7150, coldFiveDayTemp: -46, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Поярково": { degreeDays: 6100, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Белогорск": { degreeDays: 6060, coldFiveDayTemp: -39, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Благовещенск": { degreeDays: 6060, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Зея": { degreeDays: 6360, coldFiveDayTemp: -46, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Райчихинск": { degreeDays: 6170, coldFiveDayTemp: -40, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Свободный": { degreeDays: 6180, coldFiveDayTemp: -39, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Тында": { degreeDays: 7100, coldFiveDayTemp: -49, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Архангельская область": {
    "Вельск": { degreeDays: 6040, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Каргополь": { degreeDays: 6100, coldFiveDayTemp: -37, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Котлас": { degreeDays: 6000, coldFiveDayTemp: -40, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Мезень": { degreeDays: 6160, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Няндома": { degreeDays: 6100, coldFiveDayTemp: -39, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Онега": { degreeDays: 5950, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Плесецк": { degreeDays: 5990, coldFiveDayTemp: -39, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Северодвинск": { degreeDays: 5880, coldFiveDayTemp: -34, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Шенкурск": { degreeDays: 6050, coldFiveDayTemp: -39, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Архангельск": { degreeDays: 5890, coldFiveDayTemp: -34, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Астраханская область": {
    "Ахтубинск": { degreeDays: 1350, coldFiveDayTemp: -25, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Знаменск": { degreeDays: 1200, coldFiveDayTemp: -24, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Камызяк": { degreeDays: 1100, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Астрахань": { degreeDays: 1200, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Башкортостан": {
    "Агидель": { degreeDays: 5210, coldFiveDayTemp: -34, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Белорецк": { degreeDays: 5540, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Благовещенск": { degreeDays: 4950, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Давлеканово": { degreeDays: 4700, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Дюртюли": { degreeDays: 5230, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Кумертау": { degreeDays: 4870, coldFiveDayTemp: -34, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Мелеуз": { degreeDays: 4900, coldFiveDayTemp: -34, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Нефтекамск": { degreeDays: 5230, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Октябрьский": { degreeDays: 5170, coldFiveDayTemp: -34, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сибай": { degreeDays: 5550, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Стерлитамак": { degreeDays: 5120, coldFiveDayTemp: -34, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Белебей": { degreeDays: 4730, coldFiveDayTemp: -34, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ишимбай": { degreeDays: 5180, coldFiveDayTemp: -34, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Салават": { degreeDays: 5180, coldFiveDayTemp: -34, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Уфа": { degreeDays: 5250, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Белгородская область": {
    "Алексеевка": { degreeDays: 4180, coldFiveDayTemp: -27, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Губкин": { degreeDays: 4150, coldFiveDayTemp: -27, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Новый Оскол": { degreeDays: 4180, coldFiveDayTemp: -27, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Шебекино": { degreeDays: 4140, coldFiveDayTemp: -26, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Белгород": { degreeDays: 4150, coldFiveDayTemp: -26, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Старый Оскол": { degreeDays: 4150, coldFiveDayTemp: -27, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Брянская область": {
    "Дятьково": { degreeDays: 4730, coldFiveDayTemp: -28, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Жуковка": { degreeDays: 4710, coldFiveDayTemp: -27, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Новозыбков": { degreeDays: 4690, coldFiveDayTemp: -27, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сельцо": { degreeDays: 4720, coldFiveDayTemp: -27, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Бурятия": {
    "Бабушкин": { degreeDays: 7050, coldFiveDayTemp: -39, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Багдарин": { degreeDays: 8700, coldFiveDayTemp: -49, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Баргузин": { degreeDays: 7400, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Гусиное Озеро": { degreeDays: 6990, coldFiveDayTemp: -45, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Каменск": { degreeDays: 7600, coldFiveDayTemp: -43, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Кижинга": { degreeDays: 7730, coldFiveDayTemp: -46, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Курумкан": { degreeDays: 7800, coldFiveDayTemp: -43, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Мухоршибирь": { degreeDays: 7490, coldFiveDayTemp: -42, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Селенгинск": { degreeDays: 6980, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сосново-Озерское": { degreeDays: 7850, coldFiveDayTemp: -42, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Владимирская область": {
    "Гусь-Хрустальный": { degreeDays: 4680, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ковров": { degreeDays: 4700, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Радужный": { degreeDays: 4640, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Собинка": { degreeDays: 4660, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Волгоградская область": {
    "Дубовка": { degreeDays: 2380, coldFiveDayTemp: -29, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Жирновск": { degreeDays: 2710, coldFiveDayTemp: -30, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Калач-на-Дону": { degreeDays: 2310, coldFiveDayTemp: -29, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Котельниково": { degreeDays: 2130, coldFiveDayTemp: -28, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Михайловка": { degreeDays: 2460, coldFiveDayTemp: -29, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Палласовка": { degreeDays: 1280, coldFiveDayTemp: -30, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Фролово": { degreeDays: 2350, coldFiveDayTemp: -29, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Вологодская область": {
    "Бабаево": { degreeDays: 5590, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Белозерск": { degreeDays: 5550, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Великий Устюг": { degreeDays: 5770, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Грязовец": { degreeDays: 5520, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Кириллов": { degreeDays: 5490, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сокол": { degreeDays: 5530, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Тотьма": { degreeDays: 5610, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Устюжна": { degreeDays: 5430, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Чагода": { degreeDays: 5460, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Воронежская область": {
    "Бобров": { degreeDays: 3570, coldFiveDayTemp: -27, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Борисоглебск": { degreeDays: 3700, coldFiveDayTemp: -27, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Бутурлиновка": { degreeDays: 3570, coldFiveDayTemp: -27, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Калач": { degreeDays: 3600, coldFiveDayTemp: -27, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Лиски": { degreeDays: 3550, coldFiveDayTemp: -27, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Нововоронеж": { degreeDays: 3540, coldFiveDayTemp: -27, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Острогожск": { degreeDays: 3530, coldFiveDayTemp: -27, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Павловск": { degreeDays: 3520, coldFiveDayTemp: -27, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Россошь": { degreeDays: 3660, coldFiveDayTemp: -27, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Семилуки": { degreeDays: 3540, coldFiveDayTemp: -27, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Дагестан": {
    "Буйнакск": { degreeDays: 1500, coldFiveDayTemp: -19, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Каспийск": { degreeDays: 1400, coldFiveDayTemp: -18, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Хасавюрт": { degreeDays: 1500, coldFiveDayTemp: -19, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Еврейская авт. обл.": {
    "Облучье": { degreeDays: 7700, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Птичник": { degreeDays: 7350, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Забайкальский край": {
    "Агинское": { degreeDays: 9150, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Балей": { degreeDays: 9550, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Калга": { degreeDays: 9420, coldFiveDayTemp: -42, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Могоча": { degreeDays: 10200, coldFiveDayTemp: -45, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Нерчинск": { degreeDays: 9380, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Петровск-Забайкальский": { degreeDays: 9460, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сретенск": { degreeDays: 9380, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Чернышевск": { degreeDays: 9720, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Шилка": { degreeDays: 9580, coldFiveDayTemp: -42, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Ивановская область": {
    "Вичуга": { degreeDays: 4710, coldFiveDayTemp: -34, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Кохма": { degreeDays: 4730, coldFiveDayTemp: -34, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Тейково": { degreeDays: 4750, coldFiveDayTemp: -34, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Фурманов": { degreeDays: 4690, coldFiveDayTemp: -34, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Шуя": { degreeDays: 4720, coldFiveDayTemp: -34, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Ингушетия": {
    "Карабулак": { degreeDays: 1700, coldFiveDayTemp: -18, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Малгобек": { degreeDays: 1700, coldFiveDayTemp: -18, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Назрань": { degreeDays: 1700, coldFiveDayTemp: -18, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Иркутская область": {
    "Бодайбо": { degreeDays: 8030, coldFiveDayTemp: -51, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Братск": { degreeDays: 7850, coldFiveDayTemp: -47, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Зима": { degreeDays: 7610, coldFiveDayTemp: -47, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Нижнеудинск": { degreeDays: 7810, coldFiveDayTemp: -47, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Саянск": { degreeDays: 7700, coldFiveDayTemp: -47, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Тулун": { degreeDays: 7820, coldFiveDayTemp: -47, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Усолье-Сибирское": { degreeDays: 7510, coldFiveDayTemp: -47, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Усть-Илимск": { degreeDays: 7990, coldFiveDayTemp: -49, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Усть-Кут": { degreeDays: 8050, coldFiveDayTemp: -49, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Кабардино-Балкария": {
    "Баксан": { degreeDays: 2230, coldFiveDayTemp: -21, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Прохладный": { degreeDays: 2250, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Калининградская область": {
    "Гвардейск": { degreeDays: 3250, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Гусев": { degreeDays: 3240, coldFiveDayTemp: -23, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Советск": { degreeDays: 3250, coldFiveDayTemp: -23, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Черняховск": { degreeDays: 3230, coldFiveDayTemp: -23, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Калмыкия": {
    "Городовиковск": { degreeDays: 1800, coldFiveDayTemp: -24, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Лагань": { degreeDays: 1800, coldFiveDayTemp: -21, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Калужская область": {
    "Белоусово": { degreeDays: 4500, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Киров": { degreeDays: 4570, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Козельск": { degreeDays: 4550, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Людиново": { degreeDays: 4530, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Малоярославец": { degreeDays: 4560, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сухиничи": { degreeDays: 4560, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Камчатский край": {
    "Вилючинск": { degreeDays: 2920, coldFiveDayTemp: -29, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Елизово": { degreeDays: 2910, coldFiveDayTemp: -30, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Петропавловск-Камчатский": { degreeDays: 2890, coldFiveDayTemp: -30, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Карачаево-Черкесия": {
    "Карачаевск": { degreeDays: 2590, coldFiveDayTemp: -21, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Теберда": { degreeDays: 2520, coldFiveDayTemp: -21, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Карелия": {
    "Калевала": { degreeDays: 5730, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Кемь": { degreeDays: 5870, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Кондопога": { degreeDays: 5530, coldFiveDayTemp: -34, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Лахденпохья": { degreeDays: 5310, coldFiveDayTemp: -33, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Медвежьегорск": { degreeDays: 5610, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Олонец": { degreeDays: 5470, coldFiveDayTemp: -33, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Питкяранта": { degreeDays: 5350, coldFiveDayTemp: -33, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Пудож": { degreeDays: 5700, coldFiveDayTemp: -34, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сортавала": { degreeDays: 5370, coldFiveDayTemp: -33, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Суоярви": { degreeDays: 5480, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Кемеровская область": {
    "Анжеро-Судженск": { degreeDays: 6200, coldFiveDayTemp: -40, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Белово": { degreeDays: 6160, coldFiveDayTemp: -40, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Киселёвск": { degreeDays: 6200, coldFiveDayTemp: -40, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ленинск-Кузнецкий": { degreeDays: 6170, coldFiveDayTemp: -40, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Мариинск": { degreeDays: 6220, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Полысаево": { degreeDays: 6180, coldFiveDayTemp: -40, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Таштагол": { degreeDays: 6290, coldFiveDayTemp: -40, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Топки": { degreeDays: 6150, coldFiveDayTemp: -40, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Юрга": { degreeDays: 6150, coldFiveDayTemp: -40, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Кировская область": {
    "Кирово-Чепецк": { degreeDays: 5240, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Омутнинск": { degreeDays: 5300, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Слободской": { degreeDays: 5220, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Яранск": { degreeDays: 5150, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Коми": {
    "Емва": { degreeDays: 9200, coldFiveDayTemp: -46, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Инта": { degreeDays: 10500, coldFiveDayTemp: -46, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Микунь": { degreeDays: 9210, coldFiveDayTemp: -46, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Печора": { degreeDays: 9530, coldFiveDayTemp: -46, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сосногорск": { degreeDays: 9430, coldFiveDayTemp: -46, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Усинск": { degreeDays: 9930, coldFiveDayTemp: -46, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Усогорск": { degreeDays: 9300, coldFiveDayTemp: -46, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ухта": { degreeDays: 9370, coldFiveDayTemp: -46, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Костромская область": {
    "Галич": { degreeDays: 4870, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Нея": { degreeDays: 4900, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Шарья": { degreeDays: 4890, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Краснодарский край": {
    "Анапа": { degreeDays: 1300, coldFiveDayTemp: -18, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Армавир": { degreeDays: 2440, coldFiveDayTemp: -24, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Геленджик": { degreeDays: 1200, coldFiveDayTemp: -18, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Краснодар": { degreeDays: 1960, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Новороссийск": { degreeDays: 1200, coldFiveDayTemp: -17, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сочи": { degreeDays: 576, coldFiveDayTemp: -15, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Красноярский край": {
    "Боготол": { degreeDays: 6500, coldFiveDayTemp: -46, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Бородино": { degreeDays: 6600, coldFiveDayTemp: -46, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Дивногорск": { degreeDays: 6590, coldFiveDayTemp: -46, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Енисейск": { degreeDays: 6700, coldFiveDayTemp: -46, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Железногорск": { degreeDays: 6620, coldFiveDayTemp: -46, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Зеленогорск": { degreeDays: 6630, coldFiveDayTemp: -46, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Игарка": { degreeDays: 11100, coldFiveDayTemp: -52, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Канск": { degreeDays: 6620, coldFiveDayTemp: -46, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Лесосибирск": { degreeDays: 6690, coldFiveDayTemp: -46, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Минусинск": { degreeDays: 6250, coldFiveDayTemp: -46, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Назарово": { degreeDays: 6550, coldFiveDayTemp: -46, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Норильск": { degreeDays: 11260, coldFiveDayTemp: -52, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Анжеро-Судженск": { degreeDays: 6200, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Белово": { degreeDays: 6160, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Киселёвск": { degreeDays: 6200, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ленинск-Кузнецкий": { degreeDays: 6170, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Мариинск": { degreeDays: 6220, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Полысаево": { degreeDays: 6180, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Таштагол": { degreeDays: 6290, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Топки": { degreeDays: 6150, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Юрга": { degreeDays: 6150, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Кировская область": {
    "Кирово-Чепецк": { degreeDays: 5240, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Омутнинск": { degreeDays: 5300, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Слободской": { degreeDays: 5220, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Яранск": { degreeDays: 5150, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Коми": {
    "Емва": { degreeDays: 9200, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Инта": { degreeDays: 10500, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Микунь": { degreeDays: 9210, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Печора": { degreeDays: 9530, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сосногорск": { degreeDays: 9430, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Усинск": { degreeDays: 9930, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Усогорск": { degreeDays: 9300, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ухта": { degreeDays: 9370, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Костромская область": {
    "Галич": { degreeDays: 4870, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Нея": { degreeDays: 4900, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Шарья": { degreeDays: 4890, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Краснодарский край": {
    "Анапа": { degreeDays: 1300, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Армавир": { degreeDays: 2440, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Геленджик": { degreeDays: 1200, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Краснодар": { degreeDays: 1960, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Новороссийск": { degreeDays: 1200, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сочи": { degreeDays: 576, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Красноярский край": {
    "Боготол": { degreeDays: 6500, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Бородино": { degreeDays: 6600, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Дивногорск": { degreeDays: 6590, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Енисейск": { degreeDays: 6700, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Железногорск": { degreeDays: 6620, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Зеленогорск": { degreeDays: 6630, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Игарка": { degreeDays: 11100, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Канск": { degreeDays: 6620, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Лесосибирск": { degreeDays: 6690, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Минусинск": { degreeDays: 6250, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Назарово": { degreeDays: 6550, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Норильск": { degreeDays: 11260, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сосновоборск": { degreeDays: 6590, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Уяр": { degreeDays: 6610, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Курганская область": {
    "Далматово": { degreeDays: 6050, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Катайск": { degreeDays: 6020, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Макушино": { degreeDays: 6070, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Петухово": { degreeDays: 6030, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Шадринск": { degreeDays: 6060, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Шумиха": { degreeDays: 6030, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Щучье": { degreeDays: 6060, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Курская область": {
    "Дмитриев": { degreeDays: 4480, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Железногорск": { degreeDays: 4510, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Курск": { degreeDays: 4500, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Льгов": { degreeDays: 4450, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Обоянь": { degreeDays: 4440, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Рыльск": { degreeDays: 4420, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Суджа": { degreeDays: 4420, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Ленинградская область": {
    "Волхов": { degreeDays: 4750, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Выборг": { degreeDays: 4640, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Гатчина": { degreeDays: 4720, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Кингисепп": { degreeDays: 4660, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Кириши": { degreeDays: 4780, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Кировск": { degreeDays: 4800, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Лодейное Поле": { degreeDays: 4900, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Луга": { degreeDays: 4740, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Тихвин": { degreeDays: 4900, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Тосно": { degreeDays: 4760, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Липецкая область": {
    "Грязи": { degreeDays: 4200, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Данков": { degreeDays: 4170, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Елец": { degreeDays: 4220, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Лебедянь": { degreeDays: 4190, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Усмань": { degreeDays: 4180, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Чаплыгин": { degreeDays: 4180, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Магаданская область": {
    "Магадан": { degreeDays: 7380, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ола": { degreeDays: 7470, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сусуман": { degreeDays: 10280, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ягодное": { degreeDays: 10250, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Марий Эл": {
    "Волжск": { degreeDays: 4950, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Звенигово": { degreeDays: 4930, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Йошкар-Ола": { degreeDays: 4970, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Козьмодемьянск": { degreeDays: 4990, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Мордовия": {
    "Ардатов": { degreeDays: 4810, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ковылкино": { degreeDays: 4800, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Рузаевка": { degreeDays: 4850, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Саранск": { degreeDays: 4840, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Темников": { degreeDays: 4840, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Москва": {
    "Зеленоград": { degreeDays: 4920, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Москва": { degreeDays: 4943, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Московская область": {
    "Балашиха": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Бронницы": { degreeDays: 4950, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Видное": { degreeDays: 4930, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Воскресенск": { degreeDays: 4930, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Дедовск": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Дзержинский": { degreeDays: 4930, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Дмитров": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Долгопрудный": { degreeDays: 4930, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Домодедово": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Дубна": { degreeDays: 4950, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Егорьевск": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Железнодорожный": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Жуковский": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Зарайск": { degreeDays: 4930, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Звенигород": { degreeDays: 4950, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ивантеевка": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Истра": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Кашира": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Клин": { degreeDays: 4950, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Коломна": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Королёв": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Котельники": { degreeDays: 4930, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Красногорск": { degreeDays: 4930, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Лобня": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Лосино-Петровский": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Лыткарино": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Люберцы": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Можайск": { degreeDays: 4950, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Мытищи": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Наро-Фоминск": { degreeDays: 4950, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ногинск": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Одинцово": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Озёры": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Орехово-Зуево": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Павловский Посад": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Подольск": { degreeDays: 4950, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Протвино": { degreeDays: 4950, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Пушкино": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Пущино": { degreeDays: 4950, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Раменское": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Реутов": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Руза": { degreeDays: 4950, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сергиев Посад": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Серебряные Пруды": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Серпухов": { degreeDays: 4950, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Солнечногорск": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ступино": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Талдом": { degreeDays: 4950, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Фрязино": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Химки": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Чехов": { degreeDays: 4950, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Шатура": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Щёлково": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Электросталь": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Юбилейный": { degreeDays: 4940, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Мурманская область": {
    "Оленегорск": { degreeDays: 6255, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Полярные Зори": { degreeDays: 6220, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Североморск": { degreeDays: 6200, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Ненецкий автономный округ": {
    "Нарьян-Мар": { degreeDays: 9530, coldFiveDayTemp: -44, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Нижегородская область": {
    "Арзамас": { degreeDays: 4760, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Дзержинск": { degreeDays: 4770, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Нижний Новгород": { degreeDays: 4780, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Саров": { degreeDays: 4780, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Новгородская область": {
    "Боровичи": { degreeDays: 4500, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Великий Новгород": { degreeDays: 4450, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Старая Русса": { degreeDays: 4470, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Новосибирская область": {
    "Бердск": { degreeDays: 6092, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Искитим": { degreeDays: 6100, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Новосибирск": { degreeDays: 6092, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Обь": { degreeDays: 6100, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Тогучин": { degreeDays: 6150, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Омская область": {
    "Исилькуль": { degreeDays: 6200, coldFiveDayTemp: -44, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Калачинск": { degreeDays: 6230, coldFiveDayTemp: -44, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Омск": { degreeDays: 6250, coldFiveDayTemp: -44, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Тара": { degreeDays: 6250, coldFiveDayTemp: -44, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Оренбургская область": {
    "Бугуруслан": { degreeDays: 4860, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Бузулук": { degreeDays: 4860, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Гай": { degreeDays: 5020, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Кувандык": { degreeDays: 4940, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Медногорск": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Новотроицк": { degreeDays: 4990, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Оренбург": { degreeDays: 4810, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Орск": { degreeDays: 5040, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сорочинск": { degreeDays: 4800, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Орловская область": {
    "Болхов": { degreeDays: 4480, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Дмитровск": { degreeDays: 4450, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ливны": { degreeDays: 4420, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Мценск": { degreeDays: 4450, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Орёл": { degreeDays: 4470, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Покровское": { degreeDays: 4450, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Пензенская область": {
    "Белинский": { degreeDays: 4380, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Городище": { degreeDays: 4420, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Заречный": { degreeDays: 4400, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Каменка": { degreeDays: 4380, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Кузнецк": { degreeDays: 4330, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Нижний Ломов": { degreeDays: 4340, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Пенза": { degreeDays: 4400, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сердобск": { degreeDays: 4250, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Спасск": { degreeDays: 4350, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Пермский край": {
    "Березники": { degreeDays: 6000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Кунгур": { degreeDays: 6000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Лысьва": { degreeDays: 6000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Пермь": { degreeDays: 6000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Соликамск": { degreeDays: 6000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Чайковский": { degreeDays: 6000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Чусовой": { degreeDays: 6000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Приморский край": {
    "Арсеньев": { degreeDays: 5000, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Артём": { degreeDays: 5000, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Большой Камень": { degreeDays: 5000, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Владивосток": { degreeDays: 5000, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Дальнегорск": { degreeDays: 5000, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Дальнереченск": { degreeDays: 5000, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Лесозаводск": { degreeDays: 5000, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Находка": { degreeDays: 5000, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Партизанск": { degreeDays: 5000, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Спасск-Дальний": { degreeDays: 5000, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Уссурийск": { degreeDays: 5000, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Фокино": { degreeDays: 5000, coldFiveDayTemp: -35, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Псковская область": {
    "Великие Луки": { degreeDays: 4500, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Гдов": { degreeDays: 4500, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Дно": { degreeDays: 4500, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Невель": { degreeDays: 4500, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Новоржев": { degreeDays: 4500, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Новосокольники": { degreeDays: 4500, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Опочка": { degreeDays: 4500, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Остров": { degreeDays: 4500, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Печоры": { degreeDays: 4500, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Порхов": { degreeDays: 4500, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Псков": { degreeDays: 4500, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Пустошка": { degreeDays: 4500, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Пыталово": { degreeDays: 4500, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Себеж": { degreeDays: 4500, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Республика Адыгея": {
    "Адыгейск": { degreeDays: 2000, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Майкоп": { degreeDays: 2000, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Республика Алтай": {
    "Горно-Алтайск": { degreeDays: 6000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Республика Башкортостан": {
    "Агидель": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Баймак": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Белебей": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Белорецк": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Бирск": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Благовещенск": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Давлеканово": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Дюртюли": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ишимбай": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Кумертау": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Мелеуз": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Нефтекамск": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Октябрьский": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Салават": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сибай": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Стерлитамак": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Туймазы": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Уфа": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Учалы": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Янаул": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Республика Бурятия": {
    "Бабушкин": { degreeDays: 6000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Гусиноозёрск": { degreeDays: 6000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Закаменск": { degreeDays: 6000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Кяхта": { degreeDays: 6000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Северобайкальск": { degreeDays: 6000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Улан-Удэ": { degreeDays: 6000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Республика Калмыкия": {
    "Городовиковск": { degreeDays: 3000, coldFiveDayTemp: -27, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Лагань": { degreeDays: 3000, coldFiveDayTemp: -27, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Республика Карелия": {
    "Беломорск": { degreeDays: 6000, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Кемь": { degreeDays: 6000, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Кондопога": { degreeDays: 6000, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Костомукша": { degreeDays: 6000, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Лахденпохья": { degreeDays: 6000, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Медвежьегорск": { degreeDays: 6000, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Олонец": { degreeDays: 6000, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Петрозаводск": { degreeDays: 6000, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Питкяранта": { degreeDays: 6000, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Пудож": { degreeDays: 6000, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сегежа": { degreeDays: 6000, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сортавала": { degreeDays: 6000, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Суоярви": { degreeDays: 6000, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Республика Коми": {
    "Воркута": { degreeDays: 8000, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Вуктыл": { degreeDays: 8000, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Емва": { degreeDays: 8000, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Инта": { degreeDays: 8000, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Микунь": { degreeDays: 8000, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Печора": { degreeDays: 8000, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сосногорск": { degreeDays: 8000, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сыктывкар": { degreeDays: 8000, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Усинск": { degreeDays: 8000, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ухта": { degreeDays: 8000, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Республика Крым": {
    "Алупка": { degreeDays: 2000, coldFiveDayTemp: -18, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Алушта": { degreeDays: 2000, coldFiveDayTemp: -18, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Армянск": { degreeDays: 2000, coldFiveDayTemp: -18, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Бахчисарай": { degreeDays: 2000, coldFiveDayTemp: -18, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Белогорск": { degreeDays: 2000, coldFiveDayTemp: -18, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Джанкой": { degreeDays: 2000, coldFiveDayTemp: -18, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Евпатория": { degreeDays: 2000, coldFiveDayTemp: -18, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Керчь": { degreeDays: 2000, coldFiveDayTemp: -18, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Красноперекопск": { degreeDays: 2000, coldFiveDayTemp: -18, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Саки": { degreeDays: 2000, coldFiveDayTemp: -18, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Симферополь": { degreeDays: 2000, coldFiveDayTemp: -18, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Старый Крым": { degreeDays: 2000, coldFiveDayTemp: -18, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Судак": { degreeDays: 2000, coldFiveDayTemp: -18, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Феодосия": { degreeDays: 2000, coldFiveDayTemp: -18, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Щёлкино": { degreeDays: 2000, coldFiveDayTemp: -18, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ялта": { degreeDays: 2000, coldFiveDayTemp: -18, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Республика Марий Эл": {
    "Волжск": { degreeDays: 5000, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Звенигово": { degreeDays: 5000, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Йошкар-Ола": { degreeDays: 5000, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Козьмодемьянск": { degreeDays: 5000, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Республика Мордовия": {
    "Ардатов": { degreeDays: 5000, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Инсар": { degreeDays: 5000, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ковылкино": { degreeDays: 5000, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Краснослободск": { degreeDays: 5000, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Рузаевка": { degreeDays: 5000, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Саранск": { degreeDays: 5000, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Темников": { degreeDays: 5000, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Республика Саха (Якутия)": {
    "Алдан": { degreeDays: 10000, coldFiveDayTemp: -55, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Верхоянск": { degreeDays: 10000, coldFiveDayTemp: -55, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Вилюйск": { degreeDays: 10000, coldFiveDayTemp: -55, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ленск": { degreeDays: 10000, coldFiveDayTemp: -55, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Мирный": { degreeDays: 10000, coldFiveDayTemp: -55, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Нерюнгри": { degreeDays: 10000, coldFiveDayTemp: -55, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Нюрба": { degreeDays: 10000, coldFiveDayTemp: -55, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Олёкминск": { degreeDays: 10000, coldFiveDayTemp: -55, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Покровск": { degreeDays: 10000, coldFiveDayTemp: -55, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Среднеколымск": { degreeDays: 10000, coldFiveDayTemp: -55, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Томмот": { degreeDays: 10000, coldFiveDayTemp: -55, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Удачный": { degreeDays: 10000, coldFiveDayTemp: -55, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Якутск": { degreeDays: 10000, coldFiveDayTemp: -55, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Республика Северная Осетия - Алания": {
    "Алагир": { degreeDays: 3000, coldFiveDayTemp: -27, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ардон": { degreeDays: 3000, coldFiveDayTemp: -27, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Беслан": { degreeDays: 3000, coldFiveDayTemp: -27, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Владикавказ": { degreeDays: 3000, coldFiveDayTemp: -27, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Дигора": { degreeDays: 3000, coldFiveDayTemp: -27, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Моздок": { degreeDays: 3000, coldFiveDayTemp: -27, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Республика Татарстан": {
    "Агрыз": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Азнакаево": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Альметьевск": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Арск": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Бавлы": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Болгар": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Бугульма": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Буинск": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Елабуга": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Заинск": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Зеленодольск": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Иннополис": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Казань": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Лаишево": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Лениногорск": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Мамадыш": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Менделеевск": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Мензелинск": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Набережные Челны": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Нижнекамск": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Нурлат": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Тетюши": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Чистополь": { degreeDays: 5000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Республика Тыва": {
    "Ак-Довурак": { degreeDays: 7000, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Кызыл": { degreeDays: 7000, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Туран": { degreeDays: 7000, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Чадан": { degreeDays: 7000, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Шагонар": { degreeDays: 7000, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Республика Хакасия": {
    "Абаза": { degreeDays: 6000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Абакан": { degreeDays: 6000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Саяногорск": { degreeDays: 6000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сорск": { degreeDays: 6000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Черногорск": { degreeDays: 6000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Республика Чечня": {
    "Аргун": { degreeDays: 2000, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Грозный": { degreeDays: 2000, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Гудермес": { degreeDays: 2000, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Урус-Мартан": { degreeDays: 2000, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Шали": { degreeDays: 2000, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Республика Чувашия": {
    "Алатырь": { degreeDays: 5000, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Канаш": { degreeDays: 5000, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Козловка": { degreeDays: 5000, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Мариинский Посад": { degreeDays: 5000, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Новочебоксарск": { degreeDays: 5000, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Цивильск": { degreeDays: 5000, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Чебоксары": { degreeDays: 5000, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Шумерля": { degreeDays: 5000, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ядрин": { degreeDays: 5000, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Чукотский автономный округ": {
    "Анадырь": { degreeDays: 8050, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Билибино": { degreeDays: 12000, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Певек": { degreeDays: 11700, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Провидения": { degreeDays: 8000, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Эгвекинот": { degreeDays: 9300, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Ямало-Ненецкий автономный округ": {
    "Губкинский": { degreeDays: 11000, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Лабытнанги": { degreeDays: 10600, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Муравленко": { degreeDays: 11000, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Надым": { degreeDays: 11000, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Новый Уренгой": { degreeDays: 11400, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ноябрьск": { degreeDays: 11000, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Салехард": { degreeDays: 11200, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Тарко-Сале": { degreeDays: 11000, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Ярославская область": {
    "Гаврилов-Ям": { degreeDays: 4690, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Любим": { degreeDays: 4780, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Мышкин": { degreeDays: 4740, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Переславль-Залесский": { degreeDays: 4630, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Пошехонье": { degreeDays: 4790, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ростов": { degreeDays: 4690, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Рыбинск": { degreeDays: 4690, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Тутаев": { degreeDays: 4700, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Углич": { degreeDays: 4710, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ярославль": { degreeDays: 4690, coldFiveDayTemp: 0, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Ростовская область": {
    "Азов": { degreeDays: 1895, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Батайск": { degreeDays: 1890, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Волгодонск": { degreeDays: 2010, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Гуково": { degreeDays: 2230, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Донецк": { degreeDays: 2200, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Зверево": { degreeDays: 2210, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Каменск-Шахтинский": { degreeDays: 2220, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Красный Сулин": { degreeDays: 2190, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Миллерово": { degreeDays: 2230, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Новочеркасск": { degreeDays: 2000, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Новошахтинск": { degreeDays: 2220, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ростов-на-Дону": { degreeDays: 1895, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Таганрог": { degreeDays: 1900, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Цимлянск": { degreeDays: 2020, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Шахты": { degreeDays: 2190, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Рязанская область": {
    "Касимов": { degreeDays: 4450, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Михайлов": { degreeDays: 4430, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Рязань": { degreeDays: 4490, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Скопин": { degreeDays: 4450, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Скопинский район": { degreeDays: 4440, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Самарская область": {
    "Жигулёвск": { degreeDays: 4990, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Кинель": { degreeDays: 4980, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Новокуйбышевск": { degreeDays: 5020, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Октябрьск": { degreeDays: 4960, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Отрадный": { degreeDays: 4990, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Похвистнево": { degreeDays: 4950, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Самара": { degreeDays: 5020, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сызрань": { degreeDays: 4950, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Тольятти": { degreeDays: 5010, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Чапаевск": { degreeDays: 4980, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Санкт-Петербург": {
    "Санкт-Петербург": { degreeDays: 4780, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Саратовская область": {
    "Аркадак": { degreeDays: 4130, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Балаково": { degreeDays: 4080, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Балашов": { degreeDays: 4190, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Вольск": { degreeDays: 4100, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ершов": { degreeDays: 4050, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Калининск": { degreeDays: 4160, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Красноармейск": { degreeDays: 4070, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Маркс": { degreeDays: 4110, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Петровск": { degreeDays: 4140, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Пугачёв": { degreeDays: 4150, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Саратов": { degreeDays: 4200, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Сахалинская область": {
    "Александровск-Сахалинский": { degreeDays: 4570, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Долинск": { degreeDays: 4620, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Корсаков": { degreeDays: 4300, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Курильск": { degreeDays: 4170, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Невельск": { degreeDays: 4230, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Оха": { degreeDays: 4550, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Поронайск": { degreeDays: 4410, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Северо-Курильск": { degreeDays: 4340, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Томари": { degreeDays: 4470, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Углегорск": { degreeDays: 4440, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Холмск": { degreeDays: 4280, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Южно-Сахалинск": { degreeDays: 4670, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Свердловская область": {
    "Алапаевск": { degreeDays: 5740, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Асбест": { degreeDays: 5700, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Верхняя Пышма": { degreeDays: 5700, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Екатеринбург": { degreeDays: 5730, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Каменск-Уральский": { degreeDays: 5770, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Краснотурьинск": { degreeDays: 6180, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Невьянск": { degreeDays: 5730, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Нижний Тагил": { degreeDays: 5900, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Первоуральск": { degreeDays: 5700, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Полевской": { degreeDays: 5730, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ревда": { degreeDays: 5720, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Серов": { degreeDays: 6100, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сухой Лог": { degreeDays: 5730, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Тавда": { degreeDays: 6060, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Туринск": { degreeDays: 6020, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Ставропольский край": {
    "Будённовск": { degreeDays: 1230, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Георгиевск": { degreeDays: 1200, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ессентуки": { degreeDays: 1200, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Кисловодск": { degreeDays: 1080, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Минеральные Воды": { degreeDays: 1200, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Невинномысск": { degreeDays: 1230, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Пятигорск": { degreeDays: 1210, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ставрополь": { degreeDays: 1220, coldFiveDayTemp: -22, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Тамбовская область": {
    "Котовск": { degreeDays: 4320, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Мичуринск": { degreeDays: 4310, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Моршанск": { degreeDays: 4330, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Рассказово": { degreeDays: 4330, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Тамбов": { degreeDays: 4300, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Тверская область": {
    "Бежецк": { degreeDays: 4840, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Вышний Волочек": { degreeDays: 4820, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Кашин": { degreeDays: 4800, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Кимры": { degreeDays: 4740, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ржев": { degreeDays: 4840, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Тверь": { degreeDays: 4530, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Торжок": { degreeDays: 4660, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Удомля": { degreeDays: 4950, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Томская область": {
    "Асино": { degreeDays: 6870, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Колпашево": { degreeDays: 6890, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Северск": { degreeDays: 6900, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Стрежевой": { degreeDays: 6960, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Томск": { degreeDays: 6900, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Тульская область": {
    "Алексин": { degreeDays: 4510, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Новомосковск": { degreeDays: 4400, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Тула": { degreeDays: 4310, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Щёкино": { degreeDays: 4330, coldFiveDayTemp: -32, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Тюменская область": {
    "Ишим": { degreeDays: 5910, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Тобольск": { degreeDays: 6000, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Тюмень": { degreeDays: 6010, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ялуторовск": { degreeDays: 5960, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Удмуртия": {
    "Воткинск": { degreeDays: 5230, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Глазов": { degreeDays: 5280, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ижевск": { degreeDays: 5250, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сарапул": { degreeDays: 5240, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Ульяновская область": {
    "Димитровград": { degreeDays: 4580, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Инза": { degreeDays: 4640, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Новоспасское": { degreeDays: 4680, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сенгилей": { degreeDays: 4610, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ульяновск": { degreeDays: 4540, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Хабаровский край": {
    "Амурск": { degreeDays: 6810, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Бикин": { degreeDays: 6630, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Комсомольск-на-Амуре": { degreeDays: 7010, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Советская Гавань": { degreeDays: 6070, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Хабаровск": { degreeDays: 6690, coldFiveDayTemp: -38, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Челябинская область": {
    "Златоуст": { degreeDays: 6080, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Копейск": { degreeDays: 5780, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Кыштым": { degreeDays: 6030, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Магнитогорск": { degreeDays: 6010, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Миасс": { degreeDays: 6040, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Сатка": { degreeDays: 6070, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Троицк": { degreeDays: 5930, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Челябинск": { degreeDays: 5790, coldFiveDayTemp: -41, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Чукотский автономный округ": {
    "Анадырь": { degreeDays: 8050, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Билибино": { degreeDays: 12000, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Певек": { degreeDays: 11700, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Провидения": { degreeDays: 8000, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Эгвекинот": { degreeDays: 9300, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Ямало-Ненецкий автономный округ": {
    "Губкинский": { degreeDays: 11000, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Лабытнанги": { degreeDays: 10600, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Муравленко": { degreeDays: 11000, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Надым": { degreeDays: 11000, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Новый Уренгой": { degreeDays: 11400, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ноябрьск": { degreeDays: 11000, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Салехард": { degreeDays: 11200, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Тарко-Сале": { degreeDays: 11000, coldFiveDayTemp: -48, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  },
  "Ярославская область": {
    "Гаврилов-Ям": { degreeDays: 4690, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Любим": { degreeDays: 4780, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Мышкин": { degreeDays: 4740, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Переславль-Залесский": { degreeDays: 4630, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Пошехонье": { degreeDays: 4790, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ростов": { degreeDays: 4690, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Рыбинск": { degreeDays: 4690, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Тутаев": { degreeDays: 4700, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Углич": { degreeDays: 4710, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 },
    "Ярославль": { degreeDays: 4690, coldFiveDayTemp: -36, absMinTemp: 0, heatingPeriod: 0, avgHeatingTemp: 0 }
  }
};

// Функция для вывода списка регионов и городов
const printRegionsAndCities = () => {
  console.log('Список регионов и городов:');
  console.log('=======================');
  
  Object.entries(CLIMATE_DATA).forEach(([region, cities]) => {
    console.log(`\n${region}:`);
    Object.keys(cities).forEach(city => {
      console.log(`  - ${city}`);
    });
  });
};

const BuildingClimatology = ({ onBack }) => {
  const [selectedRegion, setSelectedRegion] = useState(Object.keys(CLIMATE_DATA)[0]);
  const [selectedCity, setSelectedCity] = useState(Object.keys(CLIMATE_DATA[Object.keys(CLIMATE_DATA)[0]])[0]);
  const [baseTemp, setBaseTemp] = useState(18);

  // Выводим список при монтировании компонента
  useEffect(() => {
    printRegionsAndCities();
  }, []);

  const handleRegionChange = (e) => {
    const newRegion = e.target.value;
    setSelectedRegion(newRegion);
    setSelectedCity(Object.keys(CLIMATE_DATA[newRegion])[0]);
  };

  const cityData = CLIMATE_DATA[selectedRegion][selectedCity];
  
  // Calculate ГСОП based on the new base temperature
  const calculateDegreeDays = (baseTemp) => {
    const originalDegreeDays = cityData.degreeDays;
    const originalBaseTemp = 18;
    const heatingPeriod = cityData.heatingPeriod || 200; // Default to 200 if not specified
    
    // Recalculate based on the difference in base temperatures
    const tempDiff = baseTemp - originalBaseTemp;
    const newDegreeDays = originalDegreeDays + (tempDiff * heatingPeriod);
    
    return Math.round(newDegreeDays);
  };

  return (
    <div className="container">
      <div className="card" style={{position: 'relative'}}>
        <div className="header-row">
          <div className="card-title">Строительная климатология</div>
        </div>
        
        <div style={{display: 'flex', gap: '12px', marginBottom: '16px'}}>
          <div className="form-group" style={{flex: 1}}>
            <label htmlFor="region">Регион</label>
            <select 
              id="region"
              value={selectedRegion}
              onChange={handleRegionChange}
            >
              {Object.keys(CLIMATE_DATA).map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{flex: 1}}>
            <label htmlFor="city">Город</label>
            <select 
              id="city"
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
            >
              {Object.keys(CLIMATE_DATA[selectedRegion]).map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="results" style={{padding:'18px 0 8px 0'}}>
          <div className="result-item" style={{marginBottom:10, display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
            <span className="result-label">Температура холодной пятидневки (0.98)</span>
            <span className="result-value" style={{fontWeight:600, marginTop:2, color:'#4cc9f0', fontSize:'1.13em'}}>{cityData.coldFiveDayTemp} °C</span>
          </div>
          <div className="result-item" style={{marginBottom:10, display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
            <span className="result-label">Абсолютная минимальная температура</span>
            <span className="result-value" style={{fontWeight:600, marginTop:2, color:'#4cc9f0', fontSize:'1.13em'}}>{cityData.absMinTemp} °C</span>
          </div>
          <div className="result-item" style={{marginBottom:10, display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
            <span className="result-label">Продолжительность отопительного периода</span>
            <span className="result-value" style={{fontWeight:600, marginTop:2, color:'#4cc9f0', fontSize:'1.13em'}}>{cityData.heatingPeriod} суток</span>
          </div>
          <div className="result-item" style={{marginBottom:10, display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
            <span className="result-label">Средняя температура отопительного периода</span>
            <span className="result-value" style={{fontWeight:600, marginTop:2, color:'#4cc9f0', fontSize:'1.13em'}}>{cityData.avgHeatingTemp} °C</span>
          </div>
          <div className="result-item" style={{marginBottom:10, display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px'}}>
              <span className="result-label">Градусо-сутки отопительного периода</span>
              <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                <input
                  type="number"
                  value={baseTemp}
                  onChange={(e) => setBaseTemp(Number(e.target.value))}
                  style={{
                    width: '60px',
                    padding: '4px 8px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    fontSize: '0.9em'
                  }}
                />
                <span style={{fontSize: '0.9em', color: '#666'}}>°C</span>
              </div>
            </div>
            <span className="result-value" style={{fontWeight:600, marginTop:2, color:'#4cc9f0', fontSize:'1.13em'}}>
              {calculateDegreeDays(baseTemp)} °C·сут
            </span>
          </div>
        </div>

        {onBack && (
          <button
            className="back-btn"
            onClick={onBack}
            aria-label="Назад"
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'var(--main-blue)',
              color: '#fff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(76,201,240,0.13)',
              cursor: 'pointer',
              zIndex: 20,
              transition: 'background 0.2s, transform 0.2s',
              padding: 0,
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.93)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 4L8 11L15 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default BuildingClimatology; 