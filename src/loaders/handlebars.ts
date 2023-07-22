import Handlebars from "handlebars/runtime";
export default function () {
  Handlebars.registerHelper("partial", function (templateName, context) {
    console.info("registerhelper", templateName);
    return new Handlebars.SafeString(Handlebars.templates[templateName](this));
  });
  console.log("register handlebar");
  Handlebars.registerPartial(
    "header",
    `<div class="invoice-header">
  <h1>Order Placed Invoice</h1>
</div>`
  );
}
