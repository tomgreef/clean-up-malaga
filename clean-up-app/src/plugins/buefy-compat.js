// Compatibility layer to map Buefy components to Bulma-styled components
// This allows old Buefy markup to work without Buefy

export default {
	install(app) {
		// Button wrapper
		app.component('b-button', {
			template: `
				<component 
					:is="tag"
					:class="['button', typeClass, sizeClass, { 'is-loading': loading }]"
					:disabled="disabled"
					:to="to"
					@click="$emit('click', $event)"
				>
					<slot></slot>
				</component>
			`,
			props: {
				type: String,
				size: String,
				loading: Boolean,
				disabled: Boolean,
				inverted: Boolean,
				tag: {
					type: String,
					default: 'button'
				},
				to: [String, Object]
			},
			computed: {
				typeClass() {
					return this.type ? this.type : '';
				},
				sizeClass() {
					return this.size ? this.size : '';
				}
			}
		});
		
		// Navbar wrapper
		app.component('b-navbar', {
			template: `
				<nav class="navbar" :class="typeClass" role="navigation">
					<div class="navbar-brand">
						<slot name="brand"></slot>
					</div>
					<div class="navbar-menu">
						<div class="navbar-start">
							<slot name="start"></slot>
						</div>
						<div class="navbar-end">
							<slot name="end"></slot>
						</div>
					</div>
				</nav>
			`,
			props: {
				type: String,
				spaced: Boolean
			},
			computed: {
				typeClass() {
					return this.type ? this.type : '';
				}
			}
		});
		
		// Navbar item wrapper
		app.component('b-navbar-item', {
			template: `
				<component :is="tag" class="navbar-item" :to="to">
					<slot></slot>
				</component>
			`,
			props: {
				tag: {
					type: String,
					default: 'a'
				},
				to: [String, Object]
			}
		});
		
		// Field wrapper  
		app.component('b-field', {
			template: `
				<div class="field" :class="{ 'is-grouped': grouped, 'is-grouped-multiline': groupMultiline, 'is-expanded': expanded }">
					<label v-if="label" class="label">{{ label }}</label>
					<div class="control">
						<slot></slot>
					</div>
					<p v-if="message" class="help" :class="typeClass">{{ message }}</p>
				</div>
			`,
			props: {
				label: String,
				message: String,
				type: String,
				grouped: Boolean,
				groupMultiline: Boolean,
				expanded: Boolean
			},
			computed: {
				typeClass() {
					return this.type ? this.type : '';
				}
			}
		});
		
		// Input wrapper
		app.component('b-input', {
			template: `
				<input 
					class="input" 
					:class="typeClass"
					:type="type || 'text'"
					:value="modelValue"
					:placeholder="placeholder"
					:disabled="disabled"
					:required="required"
					:maxlength="maxlength"
					@input="$emit('update:modelValue', $event.target.value)"
				/>
			`,
			props: {
				modelValue: [String, Number],
				type: String,
				placeholder: String,
				disabled: Boolean,
				required: Boolean,
				maxlength: [String, Number],
				validationMessage: String
			},
			emits: ['update:modelValue'],
			computed: {
				typeClass() {
					return this.validationMessage ? 'is-danger' : '';
				}
			}
		});
		
		// Checkbox wrapper
		app.component('b-checkbox', {
			template: `
				<label class="checkbox">
					<input 
						type="checkbox"
						:checked="modelValue"
						@change="$emit('update:modelValue', $event.target.checked)"
					/>
					<slot></slot>
				</label>
			`,
			props: {
				modelValue: Boolean
			},
			emits: ['update:modelValue']
		});
		
		// Switch wrapper
		app.component('b-switch', {
			template: `
				<label class="switch">
					<input 
						type="checkbox"
						:checked="modelValue"
						@change="$emit('update:modelValue', $event.target.checked)"
					/>
					<span class="slider"></span>
					<slot></slot>
				</label>
			`,
			props: {
				modelValue: Boolean
			},
			emits: ['update:modelValue']
		});
		
		// Modal wrapper
		app.component('b-modal', {
			template: `
				<div v-if="isActive" class="modal is-active">
					<div class="modal-background" @click="close"></div>
					<div class="modal-content">
						<div class="box">
							<slot></slot>
						</div>
					</div>
					<button class="modal-close is-large" @click="close"></button>
				</div>
			`,
			props: {
				active: Boolean
			},
			emits: ['close'],
			data() {
				return {
					isActive: this.active
				};
			},
			watch: {
				active(val) {
					this.isActive = val;
				}
			},
			methods: {
				close() {
					this.isActive = false;
					this.$emit('close');
				}
			}
		});
		
		// Icon wrapper
		app.component('b-icon', {
			template: `
				<span class="icon" :class="sizeClass">
					<i :class="iconClass"></i>
				</span>
			`,
			props: {
				icon: String,
				size: String,
				pack: String
			},
			computed: {
				iconClass() {
					const pack = this.pack || 'mdi';
					return `${pack} ${pack}-${this.icon}`;
				},
				sizeClass() {
					return this.size ? `is-${this.size}` : '';
				}
			}
		});
		
		// Table wrapper
		app.component('b-table', {
			template: `
				<div class="table-container">
					<table class="table is-fullwidth is-striped is-hoverable">
						<thead>
							<tr>
								<slot name="header"></slot>
							</tr>
						</thead>
						<tbody>
							<slot></slot>
						</tbody>
					</table>
				</div>
			`,
			props: {
				data: Array,
				loading: Boolean,
				paginated: Boolean,
				perPage: Number
			}
		});
		
		// Table column wrapper
		app.component('b-table-column', {
			template: `<slot></slot>`,
			props: {
				field: String,
				label: String,
				sortable: Boolean,
				searchable: Boolean
			}
		});
		
		// Message wrapper
		app.component('b-message', {
			template: `
				<article class="message" :class="typeClass">
					<div v-if="title" class="message-header">
						<p>{{ title }}</p>
					</div>
					<div class="message-body">
						<slot></slot>
					</div>
				</article>
			`,
			props: {
				title: String,
				type: String
			},
			computed: {
				typeClass() {
					return this.type ? this.type : '';
				}
			}
		});
		
		// Pagination wrapper
		app.component('b-pagination', {
			template: `
				<nav class="pagination" role="navigation">
					<a class="pagination-previous" @click="prev" :disabled="current <= 1">Previous</a>
					<a class="pagination-next" @click="next" :disabled="current >= totalPages">Next</a>
					<ul class="pagination-list">
						<li v-for="page in totalPages" :key="page">
							<a 
								class="pagination-link" 
								:class="{ 'is-current': page === current }"
								@click="updateCurrent(page)"
							>
								{{ page }}
							</a>
						</li>
					</ul>
				</nav>
			`,
			props: {
				total: Number,
				current: Number,
				perPage: Number
			},
			emits: ['update:current'],
			computed: {
				totalPages() {
					return Math.ceil(this.total / this.perPage);
				}
			},
			methods: {
				updateCurrent(page) {
					this.$emit('update:current', page);
				},
				prev() {
					if (this.current > 1) {
						this.$emit('update:current', this.current - 1);
					}
				},
				next() {
					if (this.current < this.totalPages) {
						this.$emit('update:current', this.current + 1);
					}
				}
			}
		});
		
		// Tooltip wrapper
		app.component('b-tooltip', {
			template: `
				<span :title="label" :class="positionClass">
					<slot></slot>
				</span>
			`,
			props: {
				label: String,
				position: String
			},
			computed: {
				positionClass() {
					return this.position ? `tooltip-${this.position}` : '';
				}
			}
		});
		
		// Tag wrapper
		app.component('b-tag', {
			template: `
				<span class="tag" :class="typeClass">
					<slot></slot>
				</span>
			`,
			props: {
				type: String
			},
			computed: {
				typeClass() {
					return this.type ? this.type : '';
				}
			}
		});
		
		// Collapse wrapper
		app.component('b-collapse', {
			template: `
				<div class="collapse" :class="{ 'is-active': open }">
					<slot></slot>
				</div>
			`,
			props: {
				open: Boolean
			}
		});
		
		// Tabs wrapper
		app.component('b-tabs', {
			template: `
				<div class="tabs">
					<ul>
						<slot></slot>
					</ul>
				</div>
			`,
			props: {
				modelValue: [String, Number]
			},
			emits: ['update:modelValue']
		});
		
		// Tab item wrapper
		app.component('b-tab-item', {
			template: `
				<li :class="{ 'is-active': active }">
					<a @click="$emit('click')">
						<slot name="header">{{ label }}</slot>
					</a>
					<div v-if="active" class="tab-content">
						<slot></slot>
					</div>
				</li>
			`,
			props: {
				label: String,
				value: [String, Number],
				active: Boolean
			},
			emits: ['click']
		});
		
		// Upload wrapper
		app.component('b-upload', {
			template: `
				<div class="file">
					<label class="file-label">
						<input 
							class="file-input" 
							type="file"
							:multiple="multiple"
							:accept="accept"
							@change="handleFileChange"
						/>
						<span class="file-cta">
							<span class="file-icon">
								<i class="mdi mdi-upload"></i>
							</span>
							<span class="file-label">
								<slot>Choose a file…</slot>
							</span>
						</span>
					</label>
				</div>
			`,
			props: {
				modelValue: null,
				multiple: Boolean,
				accept: String
			},
			emits: ['update:modelValue', 'input'],
			methods: {
				handleFileChange(event) {
					const files = event.target.files;
					const value = this.multiple ? Array.from(files) : files[0];
					this.$emit('update:modelValue', value);
					this.$emit('input', value);
				}
			}
		});
		
		// Numberinput wrapper
		app.component('b-numberinput', {
			template: `
				<div class="field has-addons">
					<p class="control">
						<button class="button" @click="decrement" :disabled="disabled" type="button">
							<span class="icon"><i class="mdi mdi-minus"></i></span>
						</button>
					</p>
					<p class="control is-expanded">
						<input 
							class="input" 
							type="number"
							:value="modelValue"
							:min="min"
							:max="max"
							:step="step"
							:disabled="disabled"
							@input="handleInput"
						/>
					</p>
					<p class="control">
						<button class="button" @click="increment" :disabled="disabled" type="button">
							<span class="icon"><i class="mdi mdi-plus"></i></span>
						</button>
					</p>
				</div>
			`,
			props: {
				modelValue: Number,
				min: Number,
				max: Number,
				step: {
					type: Number,
					default: 1
				},
				disabled: Boolean
			},
			emits: ['update:modelValue', 'input'],
			methods: {
				handleInput(event) {
					const value = parseFloat(event.target.value);
					this.$emit('update:modelValue', value);
					this.$emit('input', value);
				},
				increment() {
					let newVal = (this.modelValue || 0) + this.step;
					if (this.max !== undefined && newVal > this.max) newVal = this.max;
					this.$emit('update:modelValue', newVal);
					this.$emit('input', newVal);
				},
				decrement() {
					let newVal = (this.modelValue || 0) - this.step;
					if (this.min !== undefined && newVal < this.min) newVal = this.min;
					this.$emit('update:modelValue', newVal);
					this.$emit('input', newVal);
				}
			}
		});
		
		// Carousel wrapper
		app.component('b-carousel', {
			template: `
				<div class="carousel">
					<slot></slot>
				</div>
			`,
			props: {
				modelValue: Number
			},
			emits: ['update:modelValue']
		});
		
		// Carousel item wrapper
		app.component('b-carousel-item', {
			template: `
				<div class="carousel-item">
					<slot></slot>
				</div>
			`
		});
	}
};
