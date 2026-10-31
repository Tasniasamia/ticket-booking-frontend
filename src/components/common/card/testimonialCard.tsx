import { UserAvatar } from '@/components/shared/use-avatar';
import { Testimonial } from '@/features/testimonial/types';
import { Quote } from 'lucide-react';
import React from 'react';

const TestimonialCard = ({ t, i }:{ t: Testimonial; i: number }) => {
    return (
               <figure
                  key={t.id}
                  className={`rounded-4xl p-7 ${i % 3 === 1 ? "btn-grad" : "glass"}`}
                >
                  <Quote className="size-8 opacity-60" />
                  <blockquote className="mt-4 leading-relaxed">{t.text}</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    {t.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.image_url}
                        alt={t.name}
                        className="size-10 rounded-full object-cover"
                      />
                    ) : (
                      <UserAvatar name={t.name} />
                    )}
                    <div>
                      <p className="font-semibold">{t.name}</p>
                      {t.role ? <p className="text-sm opacity-70">{t.role}</p> : null}
                    </div>
                  </figcaption>
                </figure>
    );
};

export default TestimonialCard;