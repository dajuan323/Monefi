function NewsletterSubscriptions() {
  const [formData] = useState({});
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const payload = {
      sender: { email: "Frank@monefi.com", name: "Monefi Admin" },
      to: { email: values.email, name: "Subcriber" },
      subject: "Newsletter Subscription",
      body: "Thanks for subscribing"
    }

    newsletterSubscriptionFormService
      .addEmailToSubscription(payload.to.email)
      .then(() => onEmailSuccess(payload))
      .catch(onEmailFail)
      .finally(() => {
        setSubmitting(false);
        resetForm();
      });
  };
  const navigate = useNavigate();

  const onEmailSuccess = (response) => {

    Swal.fire("Thank You For Applying!", "Email added successfully!").then(
      navigate(-1)
    ).then(
      emailService
        .subscriptionMessage(response)
        .then(onSubscriptionMessageSuccess)
        .catch(onSubscriptionMessageError)
    );

  };

  const onSubscriptionMessageSuccess = (response) => {
    _logger(response);

    _logger("Email added successfully!");
  };

  const onSubscriptionMessageError = (error) => {
    _logger({ Error: error });
    toastr.error("Something went wrong FAILED to send EMAIL!")
  };

  const onEmailFail = () => {
    Swal.fire("Thank You!", "Your Email is already subscribed!")
  };

  return (
    <div className="newsletter-subscriptions">
      <div className="newslettersubscriptions-container">
        <div className="row">
          <div className="col-sm-12">
            <div className="content">
              <h2 className="newsletter-header">Newsletter Subscription</h2>
              <Formik
                initialValues={formData}
                validationSchema={newsletterFormValidation}
                onSubmit={handleSubmit}
                name="newsletterForm"
              >
                {({ errors, touched }) => (
                  <Form>
                    <div className="form-group">
                      <h6 className="newsletter-email-text">
                        Enter your email
                      </h6>
                      <div className="newsletter-input-group">
                        <Field
                          type="email"
                          name="email"
                          className={`newsletter-form-control ${errors.email && touched.email
                            ? "newsletter-is-invalid"
                            : ""
                            }`}
                          placeholder="Enter email to subscribe"
                        />
                        <Button
                          className="newsletter-btn-success"
                          type="submit"
                        >
                          Subscribe
                        </Button>
                      </div>
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="error text-danger"
                      />
                    </div>
                  </Form>
                )}
              </Formik>
              <div className="text-center">
                <a className="newsletter-link" href="">
                  Want the latest news? Get it in your inbox.
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsletterSubscriptions;
