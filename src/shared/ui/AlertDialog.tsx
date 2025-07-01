// src/shared/ui/AlertDialog.tsx
import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

interface AlertDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    title: string;
    message: string;
    type: 'success' | 'error';
}

export const AlertDialog: React.FC<AlertDialogProps> = ({ isOpen, onOpenChange, title, message, type }) => (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className={`${type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                        {title}
                    </ModalHeader>
                    <ModalBody><p>{message}</p></ModalBody>
                    <ModalFooter>
                        <Button color={type === 'error' ? 'danger' : 'primary'} onPress={onClose}>Закрыть</Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    </Modal>
);