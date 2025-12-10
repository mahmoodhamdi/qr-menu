import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { QrCode, Zap, Globe } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">{t("common.appName")}</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t("landing.title")}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {t("landing.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/admin">{t("landing.getStarted")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/menu/demo-restaurant">{t("landing.viewDemo")}</Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-lg border bg-card">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <QrCode className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">
              {t("landing.features.qrCode")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("landing.features.qrCodeDesc")}
            </p>
          </div>

          <div className="text-center p-6 rounded-lg border bg-card">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">
              {t("landing.features.realTime")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("landing.features.realTimeDesc")}
            </p>
          </div>

          <div className="text-center p-6 rounded-lg border bg-card">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">
              {t("landing.features.multilingual")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("landing.features.multilingualDesc")}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} MWM Software Solutions. MIT License.
        </div>
      </footer>
    </div>
  );
}
