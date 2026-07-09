// Reusable Excel export. Pass column definitions ({ label, key }) and the rows;
// downloads an .xlsx. xlsx is imported dynamically so it only loads when a user
// actually exports (keeps the initial bundle small).
export const useExcel = () => {
  const exportRows = async (
    filename: string,
    columns: { label: string; key: string }[],
    rows: Record<string, any>[]
  ) => {
    const XLSX = await import("xlsx");
    const header = columns.map((c) => c.label);
    const body = rows.map((r) => columns.map((c) => r[c.key] ?? ""));
    const ws = XLSX.utils.aoa_to_sheet([header, ...body]);
    ws["!cols"] = columns.map(() => ({ wch: 20 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`);
  };
  return { exportRows };
};
