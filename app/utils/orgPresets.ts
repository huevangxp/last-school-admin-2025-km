// Org layers of a Lao school (Layer 1 = top). Used to place a teacher on a
// fixed level of the hierarchy.
export const layerOptions = [
  { value: 1, title: "Layer 1 — ຜູ້ອຳນວຍການ" }, // Director
  { value: 2, title: "Layer 2 — ຮອງຜູ້ອຳນວຍການ" }, // Deputy Director
  { value: 3, title: "Layer 3 — ຫົວໜ້າຝ່າຍ" }, // Division Head
  { value: 4, title: "Layer 4 — ຫົວໜ້າໝວດວິຊາ" }, // Subject Group Head
  { value: 5, title: "Layer 5 — ອາຈານ" }, // Teacher
];

// Standard positions in a Lao school (ຕຳແໜ່ງ), top of hierarchy first.
export const positionOptions = [
  "ຜູ້ອຳນວຍການ", // Principal / Director
  "ຮອງຜູ້ອຳນວຍການ", // Deputy Principal
  "ຫົວໜ້າຝ່າຍວິຊາການ", // Head of Academic Affairs
  "ຫົວໜ້າຝ່າຍປົກຄອງ", // Head of Administration
  "ຫົວໜ້າໝວດວິຊາ", // Head of Subject Group / Department
  "ຮອງຫົວໜ້າໝວດວິຊາ", // Deputy Head of Subject Group
  "ຄູປະຈຳຫ້ອງ", // Homeroom Teacher
  "ອາຈານ", // Teacher
];

// Standard subject groups / departments in a Lao school (ໝວດວິຊາ).
export const departmentOptions = [
  "ຄະນິດສາດ", // Mathematics
  "ວິທະຍາສາດ", // Science
  "ຟີຊິກສາດ", // Physics
  "ເຄມີສາດ", // Chemistry
  "ຊີວະສາດ", // Biology
  "ພາສາລາວ-ວັນນະຄະດີ", // Lao Language & Literature
  "ພາສາອັງກິດ", // English
  "ສັງຄົມສຶກສາ", // Social Studies
  "ປະຫວັດສາດ-ພູມສາດ", // History & Geography
  "ພົນລະເມືອງສຶກສາ", // Civic Education
  "ພະລະສຶກສາ-ສິລະປະ", // Physical Education & Arts
  "ຄອມພິວເຕີ", // Computer / IT
];
