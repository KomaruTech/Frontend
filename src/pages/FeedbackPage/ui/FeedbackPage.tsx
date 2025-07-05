// src/pages/ApplicationPage/ui/ApplicationPage.tsx
import BaseLayout from "@widgets/BaseLayout/ui/BaseLayout";
import { CustomCalendar } from "@features/calendary";
import OfferEventCar from "@features/post-event/ui/NewIvent.tsx";
import SidebarMenu from "@widgets/Header/ui/Main_menu";
import { Header } from "@widgets/Header";
import React from "react";
import ReviewCard from "@features/feedback/ui/feedback";

const ApplicationPage: React.FC = () => {
  const reviews = [
    {
      id: 1,
      title: "Мероприятие 1",
      subtitle: "One on One",
      description: "Встреча для решения вопросов по проекту",
      date: "12.07.2025",
      time: "12:00 – 14:00",
      rating: 2,
      fullDescription:
        "Обсуждение задач и планов по проекту, включая архитектуру, сроки и распределение обязанностей.",
      textReview: "Очень полезная встреча! Обсудили архитектуру и задачи на месяц.",
    },
    {
      id: 2,
      title: "Мероприятие 2",
      subtitle: "Командная сессия",
      description: "Совещание с участием всех отделов",
      date: "15.07.2025",
      time: "10:00 – 13:00",
      rating: 4,
      fullDescription: "Общая стратегическая сессия по планированию следующего квартала.",
      textReview: "Хорошая командная работа. Все вовлечены.",
    },
  ];

  return (
    <BaseLayout
      leftAside={<SidebarMenu />}
      rightAside={
        <>
          <Header />
          <OfferEventCar />
          <CustomCalendar />
        </>
      }
    >
      {/* Центр: контент (отзывы) */}
      <div className="">
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <div key={review.id} className="">
              <ReviewCard
                title={review.title}
                subtitle={review.subtitle}
                description={review.description}
                date={review.date}
                time={review.time}
                rating={review.rating}
                fullDescription={review.fullDescription}
                textReview={review.textReview}
              />
            </div>
          ))}
        </div>
      </div>
    </BaseLayout>
  );
};

export default ApplicationPage;
