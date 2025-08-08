// src/app/page.tsx
"use client"; // Add this if you need client-side interactivity

import Image from "next/image";
import {
  AiFillFileText,
  AiFillBulb,
  AiFillAudio,
} from "react-icons/ai";
import { BsStarFill, BsStarHalf } from "react-icons/bs";
import { BiCrown } from "react-icons/bi";
import { RiLeafLine } from "react-icons/ri";

export default function Home() {
  return (
    <div className="min-h-screen font-sans p-8 sm:p-20 flex flex-col gap-20">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav__wrapper flex items-center justify-between max-w-7xl mx-auto">
          <figure className="nav__img--mask relative w-47 h-16">
            <Image
              src="/logo.png" // update with your logo file path
              alt="logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </figure>
          <ul className="nav__list--wrapper flex space-x-8 text-lg">
            <li className="nav__list nav__list--login cursor-pointer">Login</li>
            <li className="nav__list nav__list--mobile cursor-pointer">About</li>
            <li className="nav__list nav__list--mobile cursor-pointer">Contact</li>
            <li className="nav__list nav__list--mobile cursor-pointer">Help</li>
          </ul>
        </div>
      </nav>

      {/* Landing Section */}
      <section id="landing" className="container max-w-7xl mx-auto">
  <div className="landing__wrapper flex flex-col sm:flex-row items-center gap-10 justify-center translate-x-2 sm:translate-x-34 -translate-y-24">
          <div className="landing__content max-w-md text-center sm:text-left -translate-y-8">
            <h1 className="landing__content__title text-4xl font-bold leading-tight">
              Gain more knowledge <br className="remove--tablet hidden sm:inline" />
              in less time
            </h1>
            <p className="landing__content__subtitle mt-4 text-lg leading-relaxed">
              Great summaries for busy people,
              <br className="remove--tablet hidden sm:inline" />
              individuals who barely have time to read,
              <br className="remove--tablet hidden sm:inline" />
              and even people who don’t like to read.
            </p>
            <button className="btn home__cta--btn mt-8 px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Login
            </button>
          </div>
          <figure className="landing__image--mask relative w-full max-w-lg h-64 sm:h-96 sm:translate-x-36">
            <Image
              src="/landing.png" // update with your landing image file path
              alt="landing"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </figure>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container max-w-7xl mx-auto sm:translate-x-36 -translate-y-36">
        <h2 className="section__title text-3xl font-semibold mb-12 text-center sm:text-left">
          Understand books in few minutes
        </h2>
        <div className="features__wrapper flex flex-col sm:flex-row justify-between gap-8 text-center sm:text-left">
          <div className="features flex flex-col items-center sm:items-start max-w-xs">
            <div className="features__icon mb-4 text-blue-600">
              <AiFillFileText size={48} />
            </div>
            <h3 className="features__title text-xl font-semibold mb-2">Read or listen</h3>
            <p className="features__sub--title text-gray-700">
              Save time by getting the core ideas from the best books.
            </p>
          </div>
          <div className="features flex flex-col items-center sm:items-start max-w-xs">
            <div className="features__icon mb-4 text-yellow-500">
              <AiFillBulb size={48} />
            </div>
            <h3 className="features__title text-xl font-semibold mb-2">Find your next read</h3>
            <p className="features__sub--title text-gray-700">
              Explore book lists and personalized recommendations.
            </p>
          </div>
          <div className="features flex flex-col items-center sm:items-start max-w-xs">
            <div className="features__icon mb-4 text-purple-600">
              <AiFillAudio size={48} />
            </div>
            <h3 className="features__title text-xl font-semibold mb-2">Briefcasts</h3>
            <p className="features__sub--title text-gray-700">Gain valuable insights from briefcasts.</p>
          </div>
        </div>

        {/* Statistics Sections */}
          <div className="statistics__wrapper">
          {/* Left Column */}
          <div className="statistics__content">
            {/* Left side headers */}
            <div className="statistics__content--header">
              <div className="statistics__heading">Enhance your knowledge</div>
              <div className="statistics__heading">Achieve greater success</div>
              <div className="statistics__heading">Improve your health</div>
              <div className="statistics__heading">Develop better parenting skills</div>
              <div className="statistics__heading">Increase happiness</div>
              <div className="statistics__heading statistics__heading--active">Be the best version of yourself!</div>
            </div>

            {/* Left side statistics */}
            <div className="statistics__content--details">
              <div className="statistics__data">
                <div className="statistics__data--number">93%</div>
                <div className="statistics__data--title">
                  of Summarist members <b>significantly increase</b> reading frequency.
                </div>
              </div>
              <div className="statistics__data">
                <div className="statistics__data--number">96%</div>
                <div className="statistics__data--title">
                  of Summarist members <b>establish better</b> habits.
                </div>
              </div>
              <div className="statistics__data">
                <div className="statistics__data--number">90%</div>
                <div className="statistics__data--title">
                  have made <b>significant positive change</b> to their lives.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="statistics__content">
            {/* Right side statistics */}
            <div className="statistics__content--details statistics__content--details-second">
              <div className="statistics__data">
                <div className="statistics__data--number">91%</div>
                <div className="statistics__data--title">
                  of Summarist members <b>report feeling more productive</b> after incorporating the service into their daily routine.
                </div>
              </div>
              <div className="statistics__data">
                <div className="statistics__data--number">94%</div>
                <div className="statistics__data--title">
                  of Summarist members have <b>noticed an improvement</b> in their overall comprehension and retention of information.
                </div>
              </div>
              <div className="statistics__data">
                <div className="statistics__data--number">88%</div>
                <div className="statistics__data--title">
                  of Summarist members <b>feel more informed</b> about current events and industry trends since using the platform.
                </div>
              </div>
            </div>

            {/* Right side headers */}
            <div className="statistics__content--header statistics__content--header-second">
              <div className="statistics__heading">Expand your learning</div>
              <div className="statistics__heading">Accomplish your goals</div>
              <div className="statistics__heading">Strengthen your vitality</div>
              <div className="statistics__heading">Become a better caregiver</div>
              <div className="statistics__heading">Improve your mood</div>
              <div className="statistics__heading">Maximize your abilities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="container max-w-7xl mx-auto">
        <h2 className="section__title text-3xl font-semibold mb-12 text-center">What our members say</h2>
        <div className="reviews__wrapper grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              name: "Hanna M.",
              body: (
                <>
                  This app has been a <b>game-changer</b> for me! It's saved me so much time and effort in reading and comprehending books. Highly recommend it to all book lovers.
                </>
              ),
            },
            {
              name: "David B.",
              body: (
                <>
                  I love this app! It provides <b>concise and accurate summaries</b> of books in a way that is easy to understand. It's also very user-friendly and intuitive.
                </>
              ),
            },
            {
              name: "Nathan S.",
              body: (
                <>
                  This app is a great way to get the main takeaways from a book without having to read the entire thing. <b>The summaries are well-written and informative.</b> Definitely worth downloading.
                </>
              ),
            },
            {
              name: "Ryan R.",
              body: (
                <>
                  If you're a busy person who <b>loves reading but doesn't have the time</b> to read every book in full, this app is for you! The summaries are thorough and provide a great overview of the book's content.
                </>
              ),
            },
          ].map(({ name, body }, idx) => (
            <div key={idx} className="review border rounded p-6 shadow hover:shadow-lg transition">
              <div className="review__header flex items-center justify-between mb-4">
                <div className="review__name font-semibold text-lg">{name}</div>
                <div className="review__stars text-yellow-500">
                  <BsStarFill />
                </div>
              </div>
              <div className="review__body text-gray-700">{body}</div>
            </div>
          ))}
        </div>

        <div className="reviews__btn--wrapper text-center mt-12">
          <button className="btn home__cta--btn px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Login
          </button>
        </div>
      </section>

      {/* Numbers Section */}
      <section id="numbers" className="container max-w-7xl mx-auto">
        <h2 className="section__title text-3xl font-semibold mb-12 text-center">Start growing with Summarist now</h2>
        <div className="numbers__wrapper flex flex-col sm:flex-row justify-around gap-12 text-center">
          <div className="numbers max-w-xs">
            <div className="numbers__icon text-yellow-500 mb-3">
              <BiCrown size={48} />
            </div>
            <div className="numbers__title text-3xl font-bold">3 Million</div>
            <div className="numbers__sub--title text-gray-700">Downloads on all platforms</div>
          </div>
          <div className="numbers max-w-xs">
            <div className="numbers__icon numbers__star--icon flex justify-center text-yellow-500 mb-3 space-x-1">
              <BsStarFill size={24} />
              <BsStarHalf size={24} />
            </div>
            <div className="numbers__title text-3xl font-bold">4.5 Stars</div>
            <div className="numbers__sub--title text-gray-700">Average ratings on iOS and Google Play</div>
          </div>
          <div className="numbers max-w-xs">
            <div className="numbers__icon text-green-600 mb-3">
              <RiLeafLine size={48} />
            </div>
            <div className="numbers__title text-3xl font-bold">97%</div>
            <div className="numbers__sub--title text-gray-700">Of Summarist members create a better reading habit</div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section id="footer" className="bg-gray-100 py-12 mt-20">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="row grid grid-cols-1 sm:grid-cols-4 gap-12 text-gray-700">
            {[
              {
                title: "Actions",
                links: [
                  "Summarist Magazine",
                  "Cancel Subscription",
                  "Help",
                  "Contact us",
                ],
              },
              {
                title: "Useful Links",
                links: [
                  "Pricing",
                  "Summarist Business",
                  "Gift Cards",
                  "Authors & Publishers",
                ],
              },
              {
                title: "Company",
                links: ["About", "Careers", "Partners", "Code of Conduct"],
              },
              {
                title: "Other",
                links: ["Sitemap", "Legal Notice", "Terms of Service", "Privacy Policies"],
              },
            ].map(({ title, links }, idx) => (
              <div key={idx} className="footer__block">
                <h4 className="footer__link--title font-semibold mb-6">{title}</h4>
                <div>
                  {links.map((link, i) => (
                    <div key={i} className="footer__link--wrapper mb-3">
                      <a href="#" className="footer__link text-gray-600 hover:text-gray-900 transition">
                        {link}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="footer__copyright--wrapper mt-12 border-t pt-6 text-center text-gray-500 text-sm">
            Copyright &copy; 2023 Summarist.
          </div>
        </div>
      </section>
    </div>
  );
}
