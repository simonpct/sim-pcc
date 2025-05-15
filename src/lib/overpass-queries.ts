const getLineTracks = (lineId: string) => {
  return `
  [out:json][timeout:25];

  // Fetch the main relation
  relation(${lineId})->.mainRelation;

  rel(r.mainRelation)->.memberRelations;

  way(r.memberRelations)["railway"="subway"];

  out body;
  >;

  out skel qt;
    `;
};

const getLineStops = (lineId: string) => {
  return `
  [out:json][timeout:25];

  relation(${lineId})->.main;

rel(r.main)->.subs;

// 2. Récupérer les stop_positions dans cette relation
node(r.subs)["public_transport"="stop_position"]->.stops;

// 3. Récupérer les relations stop_area qui contiennent ces stop_positions
relation["public_transport"="stop_area"](bn.stops)->.stopAreas;

// 4. Récupérer tous les membres des stop_areas trouvées
(
  node(r.stopAreas);
  way(r.stopAreas);
  relation(r.stopAreas);
  .stopAreas;
);

// 5. Afficher les résultats
out body;
>;
out skel qt;
    `;
};

const queries = {
  getLineTracks,
  getLineStops
};

export default queries;