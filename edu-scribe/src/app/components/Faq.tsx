import Image from "next/image";
import Logo from "./Logo";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Faq() {
  return (
    <div id="faq" className="h-full w-full scroll-m-24">
      <div className="h-full w-full grid-flow-col grid mt-[300px] px-[100px]">
        <div className="h-full col-span-5 flex flex-col">
          <h1 className="text-6xl font-extrabold text-dark mb-2">FAQ</h1>
          <h2 className="text-3xl font-semibold text-dark/55">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="w-[500px] mt-10">
            <AccordionItem value="item-1">
              <AccordionTrigger>How to get access?</AccordionTrigger>
              <AccordionContent>
                Lorem Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the industry's
                standard dummy text ever since the 1500s, when an unknown
                printer took a galley of type and scrambled it to make a type
                specimen book. It has survived not only five centuries, but
                also the leap into electronic typesetting, remaining
                essentially unchanged. It was popularised in the 1960s with
                the release of Letraset sheets containing Lorem Ipsum
                passages, and more recently with desktop publishing software
                like Aldus PageMaker including versions of Lorem Ipsum.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What courses do you offer?</AccordionTrigger>
              <AccordionContent>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo
                facilis delectus cupiditate excepturi, assumenda unde, at eum
                esse qui accusantium necessitatibus, itaque quod quo
                aspernatur error. Atque dicta excepturi eos!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How do the courses work?</AccordionTrigger>
              <AccordionContent>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quaerat corrupti possimus quo animi sapiente ut, iure
                molestiae quos a ad, reprehenderit aperiam tempora. At
                expedita est unde placeat voluptas odio.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Can I learn at my own pace?</AccordionTrigger>
              <AccordionContent>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
                excepturi obcaecati possimus architecto, dolor fuga unde
                impedit provident, esse culpa minus quas minima vero, laborum
                commodi quasi necessitatibus nisi non voluptas placeat
                repellat magni. Perferendis ipsam ad aut vitae, consequatur
                repudiandae veritatis eveniet.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>
                How do I access the course materials?
              </AccordionTrigger>
              <AccordionContent>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Distinctio ab ex ipsa dolor, veniam nihil sapiente illum
                architecto deserunt molestias cumque quam ducimus, quae
                nostrum excepturi reiciendis. Ea aspernatur accusantium cum a
                eos quidem ipsam sequi dignissimos? Perferendis cupiditate
                laudantium aliquid maxime veniam nisi suscipit quibusdam
                repellendus itaque voluptatibus temporibus deleniti eos odio
                iste, fugiat, officia tenetur rerum maiores. Quibusdam
                doloribus quae libero, perspiciatis maxime laborum consequatur
                obcaecati delectus id in sunt beatae rem natus nulla corrupti
                sint odit? Nam dolore molestiae eaque adipisci ducimus
                obcaecati quidem, dolorum rem, non aliquid et? Ipsam repellat
                perspiciatis fugit, cupiditate quis modi commodi accusantium!
                Repudiandae adipisci voluptatum consequuntur.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>How do I earn points?</AccordionTrigger>
              <AccordionContent>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Pariatur sequi amet accusamus in libero est consequuntur
                voluptatum? Impedit molestiae expedita pariatur a similique
                dolor repellat, delectus facilis dignissimos vitae deserunt
                atque iure numquam corrupti ex quaerat officiis alias
                exercitationem. Vel esse veritatis ducimus nobis quasi qui
                ipsum magnam, maxime magni tenetur mollitia minus, quibusdam
                iusto sit, voluptas numquam velit libero. Veniam voluptatem ad
                ex consectetur sed sequi aliquid quaerat exercitationem
                officia, fugit sint omnis quibusdam aspernatur qui modi. Error
                vel ad animi odio debitis quod fugiat neque expedita omnis,
                accusamus reiciendis a veniam dicta dignissimos ratione?
                Facere blanditiis, voluptatem doloremque cum ea maxime nam
                autem dolores incidunt, omnis, repellat quod suscipit delectus
                perspiciatis sequi praesentium exercitationem voluptatibus
                ducimus facilis dolorem eligendi dicta ad! Quasi voluptatum
                eligendi fugit ducimus saepe quas tenetur minima sint
                recusandae, ex ad voluptatibus temporibus optio, autem
                expedita non suscipit quibusdam rerum. Officiis ab doloribus
                laboriosam natus fugiat amet in animi fugit provident ad dolor
                aliquam, odio sit, nihil nostrum ratione neque minus
                repellendus quae. Consequatur doloribus neque exercitationem
                nisi inventore quia placeat qui explicabo sunt blanditiis,
                harum in eos pariatur corporis odio saepe, iure maiores
                aliquid doloremque nobis amet quo quae obcaecati quam. Dolores
                officia perspiciatis laboriosam molestias beatae, quia
                aliquid, minus, non adipisci sapiente architecto!
                Exercitationem odio reprehenderit perferendis doloremque
                voluptas. Fuga debitis, hic voluptatum quibusdam magnam
                cupiditate beatae cum soluta voluptas nemo voluptates
                exercitationem. Modi non eum optio, hic reprehenderit ab
                provident mollitia at ad quisquam nobis nostrum tenetur, odio
                quia, libero nesciunt molestias. Debitis molestiae aliquam
                ducimus amet. Explicabo iste saepe labore, non, debitis magnam
                beatae nulla et voluptates minima quis autem cupiditate
                placeat sunt. Temporibus quasi nobis totam, cupiditate ab
                labore quos eaque aliquam enim praesentium. Aliquam asperiores
                quis error eius ullam in odio suscipit? Fugiat autem facere
                delectus maiores doloribus accusantium, et quidem totam
                excepturi laudantium magni neque, velit impedit quae similique
                illum assumenda. Dolore expedita accusamus obcaecati non
                magni.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="h-full w-full col-span-1 flex items-end pb-10">
          <Separator orientation="vertical" className="h-64" />
        </div>
        <div className="h-full w-full col-span-5 flex flex-col items-center justify-around">
          <Image
            src="/question-purple.svg"
            width={550}
            height={525}
            alt="Picture of the author"
          />
          <div className="w-full h-auto flex flex-col gap-10 px-[100px]">
            <Logo />
            <div className="h-full w-full grid-flow-col grid">
              <div className="h-full w-full col-span-6">
                <h1 className="font-semibold text-xl">Our offert</h1>
                <ol className="text-dark/55 list-disc ml-5">
                  <li>Course Packs</li>
                  <li>Pricing</li>
                  <li>Our teachers</li>
                </ol>
              </div>
              <div className="h-full w-full col-span-6">
                <h1 className="font-semibold text-xl">About us</h1>
                <ol className="text-dark/55 list-disc ml-5">
                  <li>What we do</li>
                  <li>Our platform</li>
                  <li>FAQ</li>
                </ol>
              </div>
              <div className="h-full w-full col-span-1 flex flex-col justify-between">
                <svg
                  viewBox="0 0 24 24"
                  className="text-dark/55 fill-current w-[25px] h-[25px]"
                >
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                </svg>
                <svg
                  viewBox="0 0 24 24"
                  className="text-dark/55 fill-current w-[25px] h-[25px]"
                >
                  <path d="M7.03.084c-1.277.06-2.149.264-2.91.563a5.874 5.874 0 0 0-2.124 1.388 5.878 5.878 0 0 0-1.38 2.127C.321 4.926.12 5.8.064 7.076.008 8.354-.005 8.764.001 12.023c.007 3.259.021 3.667.083 4.947.061 1.277.264 2.149.563 2.911.308.789.72 1.457 1.388 2.123a5.872 5.872 0 0 0 2.129 1.38c.763.295 1.636.496 2.913.552 1.278.056 1.689.069 4.947.063 3.257-.007 3.668-.021 4.947-.082 1.28-.06 2.147-.265 2.91-.563a5.881 5.881 0 0 0 2.123-1.388 5.881 5.881 0 0 0 1.38-2.129c.295-.763.496-1.636.551-2.912.056-1.28.07-1.69.063-4.948-.006-3.258-.02-3.667-.081-4.947-.06-1.28-.264-2.148-.564-2.911a5.892 5.892 0 0 0-1.387-2.123 5.857 5.857 0 0 0-2.128-1.38C19.074.322 18.202.12 16.924.066 15.647.009 15.236-.006 11.977 0 8.718.008 8.31.021 7.03.084m.14 21.693c-1.17-.05-1.805-.245-2.228-.408a3.736 3.736 0 0 1-1.382-.895 3.695 3.695 0 0 1-.9-1.378c-.165-.423-.363-1.058-.417-2.228-.06-1.264-.072-1.644-.08-4.848-.006-3.204.006-3.583.061-4.848.05-1.169.246-1.805.408-2.228.216-.561.477-.96.895-1.382a3.705 3.705 0 0 1 1.379-.9c.423-.165 1.057-.361 2.227-.417 1.265-.06 1.644-.072 4.848-.08 3.203-.006 3.583.006 4.85.062 1.168.05 1.804.244 2.227.408.56.216.96.475 1.382.895.421.42.681.817.9 1.378.165.422.362 1.056.417 2.227.06 1.265.074 1.645.08 4.848.005 3.203-.006 3.583-.061 4.848-.051 1.17-.245 1.805-.408 2.23-.216.56-.477.96-.896 1.38a3.705 3.705 0 0 1-1.378.9c-.422.165-1.058.362-2.226.418-1.266.06-1.645.072-4.85.079-3.204.007-3.582-.006-4.848-.06m9.783-16.192a1.44 1.44 0 1 0 1.437-1.442 1.44 1.44 0 0 0-1.437 1.442M5.839 12.012a6.161 6.161 0 1 0 12.323-.024 6.162 6.162 0 0 0-12.323.024M8 12.008A4 4 0 1 1 12.008 16 4 4 0 0 1 8 12.008" />
                </svg>
                <svg
                  viewBox="0 0 24 24"
                  className="text-dark/55 fill-current w-[25px] h-[25px]"
                >
                  <path d="M19 0H5a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5V5a5 5 0 0 0-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" />
                </svg>
              </div>
            </div>
            <footer className="text-dark/55 text-center">
              © edu.scribe 2024 All Rights Reserved
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
