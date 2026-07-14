import { gsap } from 'gsap';
import type { TransitionProps } from 'vue';

const { toggleTransitionComplete } = useTransitionComposable();

let matchMedia = gsap.matchMedia()

const pageTransition: TransitionProps = {
  name: 'page-transition',
  mode: 'out-in',
  onEnter: (page, done) => {
    matchMedia.add("(prefers-reduced-motion: no-preference)", () => {      
      gsap.set('.curtains-wrapper', { display: 'initial' })
      gsap
        .timeline({
          paused: true,
          onComplete() {
            toggleTransitionComplete(true);
            done();
          },
        })
        .to('.curtains--front .curtains__element', { 
          scaleY: 0,
          duration: .6,
          ease: 'power3.inOut',
          stagger: .1
        })
        .to('.curtains--back .curtains__element', { 
          scaleY: 0,
          duration: .55,
          ease: 'power3.inOut',
          stagger: .08
        }, '<+.16')
        .set('.curtains-wrapper', { display: 'none' })
        .play();
    });

    matchMedia.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(page, {autoAlpha: 0})
      gsap
        .timeline({
          paused: true,
          onComplete: () => {
            toggleTransitionComplete(true);
            done();
          },
        })
        .to(page, {autoAlpha: 1})
        .play();
    });
  },
  onLeave: (page, done) => {
    matchMedia.add("(prefers-reduced-motion: no-preference)", () => {
      toggleTransitionComplete(false);
      gsap.set('.curtains-wrapper', { display: 'initial' })
      gsap
        .timeline({ 
          paused: true,
          onComplete: () => {
            window.scrollTo(0, 0)
            setTimeout(() => {
              done()
            }, 300)
          }
        })
        .to('.curtains--back .curtains__element', {
          scaleY: 1,
          duration: .6,
          ease: 'power3.inOut',
          stagger: .1
        })
        .to('.curtains--front .curtains__element', {
          scaleY: 1,
          duration: .55,
          ease: 'power3.inOut',
          stagger: .08
        }, '<+.16')
        .play();
    })

    matchMedia.add("(prefers-reduced-motion: reduce)", () => {
      gsap
        .timeline({
          paused: true,
          onComplete() {
            toggleTransitionComplete(true);
            done();
          },
        })
        .to(page, {opacity: 0})
        .play();
    });
  }
};

export default pageTransition;
