import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section className="w-full bg-gray-50/80 scroll-mt-16" id="faq">
      
        <div className="container mx-auto px-8 mt-24 mb-16">
          <h2 className="text-3xl font-bold mb-12 text-amber-700">Frequently Asked Questions</h2>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              {
                question: "How are contest winners determined?",
                answer: "Winners are selected through a combination of community voting and AI similarity scoring. The generated image that most closely matches the daily prompt while maintaining artistic quality receives the highest score."
              },
              {
                question: "What happens if I lose my staked tokens?",
                answer: "Staked tokens are held in a smart contract and are only deducted if you violate contest rules or engage in malicious behavior. Otherwise, they're automatically returned after the contest period ends."
              },
              {
                question: "Can I participate in multiple contests simultaneously?",
                answer: "Yes! You can participate in as many contests as you'd like, as long as you meet the entry requirements and have sufficient tokens staked for each contest."
              },
              {
                question: "How often do contest prompts refresh?",
                answer: "Daily contests refresh every 24 hours at 00:00 UTC. Special contests have varying durations, which are clearly indicated on their respective pages."
              },
              {
                question: "What AI models are supported for image generation?",
                answer: "We currently support major AI image generation models including Midjourney, DALL-E, and Stable Diffusion. The specific models available may vary by contest type."
              },
              {
                question: "How do I withdraw my winnings?",
                answer: "Winnings are automatically sent to your connected wallet within 24 hours of contest completion. You can track your earnings and pending withdrawals in your dashboard."
              }
            ].map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-left text-gray-900">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {openFaq === index && (
                  <div className="px-6 py-4 text-gray-600 border-t border-gray-100 bg-gray-50">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
    </section>
  );
}
