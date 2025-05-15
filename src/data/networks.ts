export type Line = {
  id: string;
  name: string;
  logo: string;
  osmRelationId: string;
  color: string;
};

export type Network = {
  id: string;
  name: string;
  logo: string;
  theme: {
    bgColor: string;
  };
  lines: Line[];
};

const networks: Network[] = [
  {
    id: 'ratp',
    name: 'RATP',
    logo: '/images/networks/ratp.svg',
    theme: {
      bgColor: '#272727'
    },
    lines: [
      {
        id: '1',
        name: 'Ligne 1',
        logo: '/images/lines/ratp/1.svg',
        osmRelationId: '3328695',
        color: '#ffbe02'
      },
      {
        id: '6',
        name: 'Ligne 6',
        logo: '/images/lines/ratp/6.svg',
        osmRelationId: '3328765',
        color: '#83C491'
      },
      {
        id: '14',
        name: 'Ligne 14',
        logo: '/images/lines/ratp/14.svg',
        osmRelationId: '3328694',
        color: '#652D90'
      }
    ]
  }
];

export default networks;