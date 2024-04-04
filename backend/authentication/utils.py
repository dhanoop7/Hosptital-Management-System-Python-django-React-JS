#utils .py

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def send_password_email(user_email, random_password):
    subject = 'Account Verification for Registration'
    from_email = 'dhanoopsu7@gmail.com'
    recipient_list = [user_email]
    html_content = render_to_string('password_email_template.html', {'random_password': random_password})
    text_content = strip_tags(html_content)
    msg = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
    msg.attach_alternative(html_content, "text/html")
    msg.send() 