import { CSSProperties, ReactNode } from "react";
import { CSSFontVar } from "../../types";

export interface DataTableProps {
  columns: string[],
  showOpen?: boolean,
  title?: string,
  className?: string,
  children: ReactNode,
  headerStyle?: CSSProperties,
  HeaderComponent?: ReactNode,
  titleSize?: CSSFontVar,
  TitleComponent?: ReactNode,
  noData?: boolean,
  noDataMessage?: string,
  dataTestId?: string,
};