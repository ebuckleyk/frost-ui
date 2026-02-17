import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import { Card, CardContent } from '../Card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './Carousel';

function CarouselSizeDemo() {
  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="w-full max-w-sm"
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-3xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
type ComponentType = React.ComponentProps<typeof Carousel>;
const meta: Meta<ComponentType> = {
  component: Carousel,
  subcomponents: { CarouselContent, CarouselItem, CarouselNext, CarouselPrevious },
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {
  render: CarouselSizeDemo,
};
