<template>
	<section>
		<a v-if="!isChild" expanded @click="isTicketModalActive = true">
			<p class="has-text-left">
				{{ ticket.title }}
			</p>
		</a>
		<o-button
			v-else
			@click="isTicketModalActive = true"
			variant="primary"
			expanded
		>
			{{ ticket.title }}
		</o-button>

		<o-modal v-model:active="isTicketModalActive" :width="720">
			<div class="card">
				<o-carousel :autoplay="false" :indicator-inside="false">
					<o-carousel-item
						v-for="(url, i) in ticket.images"
						:key="i"
						class="card-image"
					>
						<figure class="image">
							<img :src="url" alt="No se pudo cargar la imagen" />
						</figure>
					</o-carousel-item>
				</o-carousel>
				<div class="card-content">
					<div class="media">
						<div class="media-content box">
							<h4 class="title is-4">{{ ticket.title }}</h4>
							<p>
								CP: {{ ticket.cp }}, {{ ticket.street }}
								<span v-if="ticket.streetNumber != null">
									, número
									{{ ticket.streetNumber }}
								</span>
							</p>
							<hr />
							<h4 class="title is-4">Descripción</h4>
							<p>
								{{ ticket.description }}
							</p>
							<PopUpEditTicket
								:ticket="ticket"
								v-if="
									!isAgent && ticket.userUid == currentUserUid
								"
							/>
							<SubTicketPagination
								v-if="ticket.hasChildren"
								:isAgent="isAgent"
								:parentId="ticket.id"
							/>
						</div>
					</div>
					<div class="content">
						<CommentList :ticketId="ticket.id" />
						<br v-if="showCreateComment" />
						<CreateComment
							:ticketId="ticket.id"
							v-if="showCreateComment"
						/>
					</div>
				</div>
			</div>
		</o-modal>
	</section>
</template>

<script>
	import { auth } from '@/firebase';
	import CommentList from '@/components/CommentList.vue';
	import CreateComment from '@/components/CreateComment.vue';
	import SubTicketPagination from '@/components/SubTicketPagination.vue';
	import PopUpEditTicket from '@/components/PopUpEditTicket.vue';

	export default {
		name: 'PopUpTicket',
		data: () => ({
			isTicketModalActive: false
		}),
		props: {
			ticket: Object,
			isAgent: Boolean,
			isChild: Boolean
		},
		components: {
			PopUpEditTicket,
			CommentList,
			CreateComment,
			SubTicketPagination
		},
		computed: {
			currentUserUid() {
				return auth.currentUser.uid;
			},
			showCreateComment() {
				return this.isAgent && !this.ticket.closed;
			}
		}
	};
</script>
