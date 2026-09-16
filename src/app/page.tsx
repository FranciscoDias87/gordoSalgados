"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ResponsiveImage } from "@/components/optimized-image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";
import { MenuSection } from "@/components/menu-section";
import {
  Clock,
  Gem,
  MapPin,
  PartyPopper,
  Phone,
  Rocket,
  Star,
  Zap,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { STATIC_TESTIMONIALS } from "@/hooks/use-testimonials";
import { siteConfig, whatsappLink } from "@/lib/config";

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-coxinha");
  const testimonials = STATIC_TESTIMONIALS;

  const features = [
    {
      icon: Gem,
      title: "Ingredientes Premium",
      description:
        "Selecionamos apenas os melhores ingredientes, garantindo sabor e qualidade inigualáveis.",
    },
    {
      icon: Zap,
      title: "Fritos na Hora",
      description:
        "Seus salgados são preparados no momento do pedido, chegando quentinhos e crocantes até você.",
    },
    {
      icon: Rocket,
      title: "Entrega Rápida",
      description:
        "Receba seus salgados favoritos no conforto da sua casa, com rapidez e eficiência.",
    },
  ];

  return (
    <>
      <section
        id="hero"
        className="container grid grid-cols-1 items-center gap-8 py-16 md:grid-cols-2 md:py-24"
      >
        <div
          className="flex animate-fade-in-up flex-col items-start gap-6 opacity-0"
          style={{ animationDelay: "0.2s" }}
        >
          <h1 className="font-headline text-5xl font-bold leading-tight md:text-6xl">
            O sabor que abraça o seu coração
          </h1>
          <p className="text-lg text-foreground/80 md:text-xl">
            Os melhores salgados artesanais da região, feitos com ingredientes
            premium e fritos na hora. Peça já o seu!
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg">
            <Link
              href={`${whatsappLink}?text=Olá!%20Gostaria%20de%20fazer%20um%20pedido%20na%20${siteConfig.businessName}.`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="mr-2" />
              Pedir Agora
            </Link>
          </Button>
        </div>
        <div
          className="relative h-80 w-full animate-fade-in-up overflow-hidden rounded-2xl shadow-2xl opacity-0 md:h-[450px]"
          style={{ animationDelay: "0.4s" }}
        >
          {heroImage && (
            <ResponsiveImage
              src={heroImage.imageUrl}
              alt={heroImage.description}
              containerClassName="relative h-80 w-full md:h-[450px]"
              priority
            />
          )}
        </div>
      </section>

      <section
        id="cardapio"
        className="container animate-fade-in-up py-16 opacity-0"
        style={{ animationDelay: "0.5s" }}
      >
        <h2 className="text-center font-headline text-4xl font-bold">
          Cardápio
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-foreground/70">
          Monte seu pedido e finalize direto pelo carrinho — a confirmação
          final acontece pelo WhatsApp.
        </p>
        <MenuSection />
      </section>

      <section
        id="kits-festa"
        className="container animate-fade-in-up py-16 opacity-0"
        style={{ animationDelay: "0.6s" }}
      >
        <div className="rounded-2xl border-4 border-primary bg-primary/5 p-8 text-center shadow-lg md:p-12">
          <div className="mx-auto mb-4 inline-block rounded-full bg-primary/10 p-4">
            <PartyPopper className="size-10 text-primary" />
          </div>
          <h2 className="mb-4 font-headline text-4xl font-bold">
            Kits para sua Festa!
          </h2>
          <p className="mx-auto mb-8 max-w-3xl text-lg text-foreground/80">
            Leve o sabor inconfundível da {siteConfig.businessName} para o seu
            evento. Temos opções de kits com centos de salgados que vão
            surpreender seus convidados. Entre em contato para um orçamento
            personalizado!
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg">
            <Link
              href={`${whatsappLink}?text=Olá!%20Gostaria%20de%20um%20orçamento%20para%20um%20Kit%20Festa.`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="mr-2 h-6 w-6" />
              Solicitar Orçamento via WhatsApp
            </Link>
          </Button>
        </div>
      </section>

      <section
        id="porque-nos"
        className="animate-fade-in-up bg-muted/50 py-16 opacity-0 sm:py-24"
        style={{ animationDelay: "0.7s" }}
      >
        <div className="container">
          <h2 className="text-center font-headline text-4xl font-bold">
            Por que escolher a {siteConfig.businessName}?
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center gap-4 text-center"
              >
                <div className="rounded-full bg-primary/10 p-4">
                  <feature.icon className="size-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-foreground/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="depoimentos"
        className="container animate-fade-in-up py-16 opacity-0 sm:py-24"
        style={{ animationDelay: "0.8s" }}
      >
        <h2 className="text-center font-headline text-4xl font-bold">
          O que nossos clientes dizem
        </h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="mx-auto mt-12 w-full max-w-xs sm:max-w-2xl lg:max-w-4xl"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <Card className="h-full">
                    <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
                      <Avatar className="mb-4 h-20 w-20">
                        <AvatarImage
                          src={testimonial.avatarUrl}
                          alt={`Foto de perfil de ${testimonial.name}`}
                          data-ai-hint={testimonial.avatarHint}
                        />
                        <AvatarFallback>
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="mb-2 flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`size-5 ${
                              i < testimonial.rating
                                ? "fill-primary text-primary"
                                : "text-muted-foreground/50"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mb-4 flex-1 text-sm italic text-foreground/80">
                        "{testimonial.quote}"
                      </p>
                      <p className="font-bold">{testimonial.name}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-8 sm:ml-4" />
          <CarouselNext className="mr-8 sm:mr-4" />
        </Carousel>
      </section>

      <section
        id="localizacao"
        className="container animate-fade-in-up py-16 opacity-0"
        style={{ animationDelay: "0.9s" }}
      >
        <h2 className="text-center font-headline text-4xl font-bold">
          Onde Estamos
        </h2>
        <p className="mt-4 text-center text-lg text-foreground/80">
          Venha nos fazer uma visita e retirar seus salgados quentinhos!
        </p>
        <div className="relative mt-8 h-80 w-full overflow-hidden rounded-2xl shadow-lg md:h-[450px]">
          <iframe
            src={siteConfig.contact.googleMapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Localização da ${siteConfig.businessName}`}
          ></iframe>
        </div>
      </section>
      <section
        id="contato"
        className="container animate-fade-in-up py-16 opacity-0 sm:py-24"
        style={{ animationDelay: "1.0s" }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-headline text-4xl font-bold">Entre em Contato</h2>
          <p className="mt-4 text-lg text-foreground/80">
            Estamos prontos para atender você!
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center gap-2">
              <MapPin className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold">Endereço</h3>
              <p className="text-foreground/70">
                {siteConfig.contact.address.street}
                <br />
                {siteConfig.contact.address.neighborhood},{" "}
                {siteConfig.contact.address.cityState}
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Phone className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold">WhatsApp</h3>
              <p className="text-foreground/70">
                {siteConfig.contact.displayPhoneNumber}
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Clock className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold">Horário</h3>
              <p className="text-foreground/70">
                {siteConfig.operatingHours.weekdays}
                <br />
                {siteConfig.operatingHours.weekends}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
