import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";

export const metadata = {
  title: "Maru Company",
  description: "혁신과 신뢰로 글로벌 시장을 선도합니다.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
