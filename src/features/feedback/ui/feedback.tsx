// src/features/feedback/ui/feedback.tsx
import { Calendar, Clock } from "lucide-react";
import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
  useDisclosure,
} from "@heroui/react";

interface ReviewCardProps {
  title: string;
  subtitle: string;
  description: string;
  date: string;
  time: string;
  rating: number;
  fullDescription?: string;
  textReview?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  title,
  subtitle,
  description,
  date,
  time,
  rating,
  fullDescription,
  textReview,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <div
        onClick={onOpen}
        className="cursor-pointer border border-blue-500 rounded-xl p-4 shadow-md hover:shadow-lg transition w-[600px] ml-[50px]"
      >
        <h2 className="text-md font-semibold">{title}</h2>
        <p className="text-sm font-medium text-gray-800">{subtitle}</p>
        <p className="text-sm text-gray-600">{description}</p>

        <div className="flex gap-4 mt-3 text-sm text-gray-700 items-center">
          <span className="flex items-center gap-1">
            <Calendar size={16} /> {date}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={16} /> {time}
          </span>
        </div>

        <div className="mt-3 text-sm text-gray-700">
          Рейтинг:
          <span className="ml-2">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
                ★
              </span>
            ))}
          </span>
        </div>
      </div>

      {/* Модальное окно */}
      <Modal isOpen={isOpen} onOpenChange={onClose}>
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>
            <p className="font-medium">Название: {subtitle}</p>
            <p>Описание: {description}</p>
            <p>Дата: {date}</p>
            <p>Время: {time}</p>
            {fullDescription && <p>Подробности: {fullDescription}</p>}
            {textReview && (
              <p className="italic text-gray-600 mt-2">Комментарий: "{textReview}"</p>
            )}
            <p className="mt-2">
              Рейтинг:{" "}
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
                  ★
                </span>
              ))}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button onPress={onClose} color="primary" autoFocus>
              Закрыть
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReviewCard;
