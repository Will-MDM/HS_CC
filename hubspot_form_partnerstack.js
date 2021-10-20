<script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/v2.js"></script>
<script>
  hbspt.forms.create({
	region: "na1",
	portalId: "20081375",
	formId: "e8501fdf-20a8-46ec-9944-6a23651051e1",
  onFormSubmit: function($form) {
   const email = $form[0].querySelector('input[name="email"]').value
   const firstName = $form[0].querySelector('input[name="firstname"]').value
   const lastName = $form[0].querySelector('input[name="lastname"]').value
   const role = $form[0].querySelector('select[name="primary_interest"]').value
   growsumo.data.name = firstName + ' ' + lastName
   growsumo.data.email = email
   growsumo.data.customer_key = email
   growsumo.createSignup();
  }
});
</script>
<script type='text/javascript'>(function() {var gs = document.createElement('script');gs.src = 'https://js.partnerstack.com/v1/';gs.type = 'text/javascript';gs.async = 'true';gs.onload = gs.onreadystatechange = function() {var rs = this.readyState;if (rs && rs != 'complete' && rs != 'loaded') return;try {growsumo._initialize('pk_e4iarRuoyvYogfmgQ9hTgUYSaKyL1d3G');if (typeof(growsumoInit) === 'function') {growsumoInit();}} catch (e) {}};var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(gs, s);})();</script>