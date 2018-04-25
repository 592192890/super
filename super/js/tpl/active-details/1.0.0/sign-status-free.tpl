<div class="enroll-ticket">
	<div class="ticket-body">
		<div class="ticket-content <%=btnTxt.classTxt%>">
			<% if(btnTxt.classBtn!='continue'){ %>
				<% if(data.left_num!='_max_'){ %>
					<em class="hdtxt"><%=data.signup_count%></em>人已报名，剩<em><%=data.left_num%></em>个名额
				<% }else{ %>
					<em class="hdtxt"><%=data.signup_count%></em>人已报名
				<% } %>				
			<% }else{ %>				
				<% if(data.left_num!='_max_'){ %>
					(限<em><%=data.total%></em>个名额)
				<% }else{ %>
				<% } %>
			<% } %>
		</div>
	</div>
	<div class="ticket-button">
		<div class="ui-button jSignBtn <%=btnTxt.classBtn%>"><%=btnTxt.txt%></div>
	</div>
</div>