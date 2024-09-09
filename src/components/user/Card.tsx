import {
  Card as C,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React from 'react';

interface Props {
  title: string;
  description: string;
  content: React.ReactNode;
  footer: string;
}

const Card: React.FC<Props> = ({ content, description, footer, title }) => {
  return (
    <>
      <C className='min-w-72' >
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{content}</p>
        </CardContent>
        <CardFooter>
          <p>{footer}</p>
        </CardFooter>
      </C>
    </>
  );
};

export default Card;
