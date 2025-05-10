import { motion } from 'framer-motion';

type TestimonialDetail = {
  id: number;
  content: string;
  name: string;
  position: string;
};

type TestimonialCardProps = {
  testimonial: TestimonialDetail;
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-yellow-400 flex mb-4">
        {Array(5).fill(0).map((_, i) => (
          <i key={i} className="fas fa-star"></i>
        ))}
      </div>
      <p className="mb-6 dark:text-gray-300">
        "{testimonial.content}"
      </p>
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex items-center justify-center text-gray-600">
          <i className="fas fa-user text-xl"></i>
        </div>
        <div>
          <h4 className="font-semibold dark:text-white">{testimonial.name}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.position}</p>
        </div>
      </div>
    </motion.div>
  );
}
