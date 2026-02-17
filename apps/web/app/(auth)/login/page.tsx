import * as motion from "motion/react-client";
import SignIn from "@/components/SignIn";
import { kapakanaFont, numanFont } from "@/app/fonts";

const LoginPage = () => {
  return (
    <section className="flex max-w-screen min-h-screen">
      <SignIn />
      <motion.div
        className={
          numanFont.className +
          " hidden md:flex flex-col items-center justify-center flex-1 bg-[#E5DBFF] text-[#6750A4]"
        }
      >
        <div className="flex flex-col gap-8 text-black">
            <motion.div
              className="text-3xl lg:text-5xl font-light"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 1,
              }}
            >
              Management
            </motion.div>
            <motion.div
              className="text-3xl lg:text-5xl font-light"
              initial={{
                opacity: 0,
                x: 40,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 1,
                delay: 0.5,
              }}
            >
              Made
            </motion.div>
            <motion.div
              className={
                kapakanaFont.className + " text-5xl lg:text-7xl text-[#6750A4]"
              }
              initial={{
                opacity: 0,
                x: 80,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 1,
                delay: 1,
              }}
            >
              Simpler.
            </motion.div>
          </div>
      </motion.div>
    </section>
  );
}

export default LoginPage