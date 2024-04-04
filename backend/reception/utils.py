from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def send_patient_email(user_email, patient):
    subject = 'Details has been registered'
    from_email = 'dhanoopsu7@gmail.com'
    recipient_list = [user_email]
    context = {'patient': patient}
    html_content = render_to_string('patient_email_template.html',context)
    text_content = strip_tags(html_content)
    msg = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
    msg.attach_alternative(html_content, "text/html")
    msg.send() 